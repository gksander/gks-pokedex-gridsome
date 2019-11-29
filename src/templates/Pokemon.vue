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
          <div class="display-1 mb-2">{{ $page.pokemon.name }}</div>
          <div class="mb-4">
            <poke-type-chip
              v-for="type in $page.pokemon.types"
              :key="type.id"
              :type="type"
              small
            ></poke-type-chip>
          </div>
          <!-- Weight/height -->
          <div class="d-flex mb-2">
            <div class="mr-5 d-flex align-center">
              <v-icon class="mr-2" color="grey darken-2"
                >fa-ruler-vertical</v-icon
              >
              <span class="title font-weight-thin"
                >{{ $page.pokemon.height }} ft</span
              >
            </div>
            <div class="d-flex align-center">
              <v-icon class="mr-2" color="grey darken-2">fa-weight</v-icon>
              <span class="title font-weight-thin"
                >{{ $page.pokemon.weight }} lbs</span
              >
            </div>
          </div>
          <!-- Description -->
          <div v-html="$page.pokemon.species.flavor_text"></div>
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
                'flex-wrap': true,
              }"
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
              class="flex-grow-0 d-flex px-4 py-2"
            >
              <v-icon>{{
                evChainVertical ? "fa-chevron-down" : "fa-chevron-right"
              }}</v-icon>
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
        <v-icon>fa-chevron-left</v-icon>
      </v-btn>
      <v-btn to="/" exact title="All Pokemon">
        <span>All</span>
        <v-icon>fa-list-alt</v-icon>
      </v-btn>
      <v-btn
        :to="nextLink"
        :disabled="!nextLink"
        width="100"
        title="Next Pokemon"
      >
        <span>{{ _get($page, "pokemon.next_pokemon.name", "") }}</span>
        <v-icon>fa-chevron-right</v-icon>
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

  computed: {
    prevLink() {
      return "/" + get(this.$page, "pokemon.prev_pokemon.slug", "");
    },
    nextLink() {
      return "/" + get(this.$page, "pokemon.next_pokemon.slug", "");
    },
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

    evChainVertical() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },

  methods: {
    _get: get,
  },

  mounted() {
    console.log(this.$vuetify);
  },

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
      png(width: 150, height: 150, fit: contain, background: "transparent")
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
    }
  }
</page-query>
