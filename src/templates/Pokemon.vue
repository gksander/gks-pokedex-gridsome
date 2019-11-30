<template>
  <Layout>
    <!-- Container -->
    <content-wrapper>
      <!-- Cols for display -->
      <v-row>
        <v-col cols="8" offset="2" sm="5" offset-sm="0">
          <g-image
            :src="$page.pokemon.png"
            style="width: 100%"
            :alt="`Image for ${$page.pokemon.name}`"
          ></g-image>
        </v-col>
        <v-col cols="12" sm="7">
          <div class="display-1">{{ $page.pokemon.name }}</div>
          <div class="mb-4">
            <v-row dense>
              <v-col
                v-for="type in $page.pokemon.types"
                :key="type.id"
                class="flex-grow-0"
              >
                <poke-type-chip :type="type"></poke-type-chip>
              </v-col>
            </v-row>
          </div>
          <!-- Weight/height -->
          <div class="d-flex mb-2">
            <div class="mr-5 d-flex align-center">
              <v-icon class="mr-2" color="grey darken-2">$height</v-icon>
              <span class="title font-weight-thin"
                >{{ $page.pokemon.height }} ft</span
              >
            </div>
            <div class="d-flex align-center">
              <v-icon class="mr-2" color="grey darken-2">$weight</v-icon>
              <span class="title font-weight-thin"
                >{{ $page.pokemon.weight }} lbs</span
              >
            </div>
          </div>
          <!-- Description -->
          <div v-html="$page.pokemon.species.flavor_text"></div>
          <!-- Weaknesses -->
          <div class="title mt-2">Weaknesses</div>
          <v-row dense>
            <v-col
              v-for="factor in damageFactors"
              :key="factor.type.slug"
              class="flex-grow-0"
            >
              <poke-type-chip
                :type="factor.type"
                small
                :starred="factor.factor > 3.9"
              ></poke-type-chip>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <!-- Stats -->
      <v-row>
        <v-col
          v-for="stat in $page.pokemon.stats"
          :key="stat.name"
          cols="4"
          sm="2"
          class="text-center"
        >
          <v-progress-circular
            :value="stat.base"
            class="mb-1 darken-2"
            :color="color"
            size="52"
            width="6"
          >
            {{ stat.base }}
          </v-progress-circular>
          <div :style="{ color }">
            {{ stat.name }}
          </div>
        </v-col>
      </v-row>

      <!-- Evolution chain... -->
      <template v-if="isPartOfChain">
        <v-divider class="my-6"></v-divider>
        <div
          class="d-flex"
          :class="{
            'flex-row': !evChainVertical,
            'flex-column': evChainVertical,
            'justify-center': !evChainVertical,
            'align-center': evChainVertical,
          }"
        >
          <template v-for="(bucket, i) in buckets">
            <div
              :key="bucket[0].pokemon.slug"
              :class="{
                'd-flex': true,
                'align-center': true,
                'flex-column': !evChainVertical,
                'justify-center': !evChainVertical,
              }"
              style="max-width: 100%"
              class="overflow-auto pa-2"
            >
              <poke-list-card
                v-for="species in bucket"
                :key="species.pokemon.slug"
                :pokemon="species.pokemon"
                :elevation="species.pokemon.id == $page.pokemon.id ? 8 : 2"
              ></poke-list-card>
            </div>
            <div
              v-if="i != buckets.length - 1"
              :key="i"
              class="flex-grow-0 d-flex px-2 py-2"
              :class="{
                'align-center': !evChainVertical,
              }"
            >
              <v-icon>{{ evChainVertical ? "$down" : "$right" }}</v-icon>
            </div>
          </template>
        </div>
      </template>
    </content-wrapper>

    <!-- Bottom navigation -->
    <v-bottom-navigation app grow>
      <v-btn
        :to="prevLink"
        width="100"
        :disabled="!prevLink"
        title="Previous Pokemon"
      >
        <span>{{ _get($page, "pokemon.prev_pokemon.name", "") }}</span>
        <v-icon>$prev</v-icon>
      </v-btn>
      <v-btn to="/" exact title="All Pokemon">
        <span>All</span>
        <v-icon>$list</v-icon>
      </v-btn>
      <v-btn
        :to="nextLink"
        :disabled="!nextLink"
        width="100"
        title="Next Pokemon"
      >
        <span>{{ _get($page, "pokemon.next_pokemon.name", "") }}</span>
        <v-icon>$next</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </Layout>
</template>

<script>
import PokeTypeChip from "~/components/PokeTypeChip";
import PokeListCard from "../components/PokeListCard";
import { get } from "lodash";

export default {
  components: { PokeTypeChip, PokeListCard },

  /**
   * Page data
   */
  data() {
    return {
      isMounted: false,
    };
  },

  /**
   * Computed props
   */
  computed: {
    // Links to previous/next pokemon
    prevLink() {
      return "/" + get(this.$page, "pokemon.prev_pokemon.slug", "");
    },
    nextLink() {
      return "/" + get(this.$page, "pokemon.next_pokemon.slug", "");
    },
    // Color of the pokemon (with some tweaks for light colors)
    color() {
      const color = get(this.$page, "pokemon.species.color");
      return color.replace(/white/i, "grey").replace(/yellow/i, "#c9bc4e");
    },
    // Has evolution chain?
    isPartOfChain() {
      return this.$page.pokemon.species.evolution_chain.links.length > 1;
    },
    // Evolution chain buckets...
    buckets() {
      // Start buckets
      const buckets = [],
        links = this.$page.pokemon.species.evolution_chain.links;

      // First species
      const firstSpecies = links.find(link => !link.species.evolves_from)
        .species;
      buckets[0] = [firstSpecies];

      // Loop til we can't find anything more for a bucket
      let areDone = false;
      while (!areDone) {
        const lastBucket = buckets[buckets.length - 1],
          lastBucketIds = lastBucket.map(species => species.pokemon.id);

        const newBucket = links
          .filter(link =>
            lastBucketIds.includes(get(link, "species.evolves_from.id")),
          )
          .map(link => link.species);

        if (!newBucket.length) {
          areDone = true;
        } else {
          buckets.push(newBucket);
        }
      }

      return buckets;
    },

    // Should we display evolution chain vertically? (Small screens)
    evChainVertical() {
      return !this.isMounted || this.$vuetify.breakpoint.smAndDown;
    },

    // Damage factors, form of [{type: ..., factor: 2}, ...]
    damageFactors() {
      // Group factors
      const factors = {};
      for (let factor of this.$page.pokemon.damage_factors) {
        const slug = factor.damage_type.slug;

        // If we already have a record started, append the factor
        if (factors[slug]) {
          factors[slug].factor =
            (factors[slug].factor * parseInt(factor.damage_factor)) / 100;
        }
        // Else, start a new factor
        else {
          factors[slug] = {
            type: factor.damage_type,
            factor: parseInt(factor.damage_factor) / 100,
          };
        }
      }

      // Reduce to array, only include super effective ones
      return Object.values(factors).filter(factor => factor.factor > 1);
    },
  },

  /**
   * Component methods
   */
  methods: {
    _get: get,
  },

  /**
   * On mount, mark that we're mounted. (For display purposes...)
   */
  mounted() {
    this.isMounted = true;
  },

  /**
   * Page meta
   */
  metaInfo() {
    return {
      title: this.$page.pokemon.name,
      meta: [
        {
          name: "Description",
          content: `Details about Pokemon ${this.$page.pokemon.name}`,
        },
      ],
    };
  },
};
</script>

<page-query>
  query ($id: ID!) {
    pokemon(id: $id) {
      id,
      name,
      png(width: 350, height: 350, fit: contain, background: "transparent")
      types { id, name, slug }
      weight
      height
      stats { base, name }
      prev_pokemon { name, slug }
      next_pokemon { name, slug }
      species {
        flavor_text, color,
        evolution_chain {
          links {
            species {
              pokemon { id, name, slug, png(width: 150, height: 150, fit: contain, background: "transparent") }
              evolves_from { id }
            }
          }
        }
      }
      damage_factors {
        damage_type { slug, name }
        damage_factor
      }
    }
  }
</page-query>
