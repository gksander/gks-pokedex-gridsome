<template>
  <div>
    <div class="container max-w-2xl py-6 px-2">
      <div class="grid sm:grid-cols-2 gap-12">
        <div>
          <div class="w-full relative" style="padding-top: 100%">
            <div
              class="absolute inset-0"
              :style="{
                backgroundImage: `url('/img/pokemon/${$page.pokemon.id}.svg')`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                filter: 'drop-shadow(2px 2px 2px rgba(50, 50, 50, 0.8))',
              }"
            ></div>
          </div>
        </div>
        <div>
          <div class="text-6xl">{{ $page.pokemon.name }}</div>
          <div class="flex gap-x-2 mb-4">
            <poke-type-chip
              v-for="type in $page.pokemon.types"
              :key="type.slug"
              :type="type"
            />
          </div>
          <!-- Weight/height -->
          <div class="flex mb-2">
            <div class="mr-5 flex items-center">
              <span class="">{{ $page.pokemon.height }} ft</span>
            </div>
            <div class="flex items-center">
              <span class="">{{ $page.pokemon.weight }} lbs</span>
            </div>
          </div>
          <!-- Description -->
          <div
            v-html="$page.pokemon.species.flavor_text"
            class="text-gray-800 mb-4"
          ></div>
          <!-- Weaknesses -->
          <div class="text-xl font-bold">Weaknesses</div>
          <div class="flex flex-wrap gap-1">
            <poke-type-chip
              v-for="factor in damageFactors"
              :key="factor.type.slug"
              :type="factor.type"
              small
              grayscale
              :starred="factor.factor > 3.9"
            />
          </div>
        </div>
      </div>
      <template v-if="isPartOfChain">
        <div class="mb-12"></div>
        <div class="text-3xl mb-4">Evolutions</div>
        <div class="flex gap-2 flex-col sm:flex-row">
          <template v-for="(bucket, i) in buckets">
            <div
              :key="bucket[0].pokemon.slug"
              :style="{ width: evSize, height: evSize }"
              class="overflow-auto"
            >
              <g-link
                v-for="species in bucket"
                :key="species.pokemon.slug"
                :style="{ width: evSize, height: evSize }"
                class="block relative transition-all duration-300 flex flex-col evLink"
                :to="`/${species.pokemon.slug}`"
              >
                <div class="flex-grow relative">
                  <div
                    class="absolute inset-0 evImg transition-all duration-200"
                    :style="{
                      backgroundImage: `url('/img/pokemon/${species.pokemon.id}.svg')`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center center',
                      backgroundRepeat: 'no-repeat',
                    }"
                  />
                </div>
                <div
                  :class="[
                    'text-center text-gray-700 overflow-hidden whitespace-no-wrap',
                    species.pokemon.id == $page.pokemon.id &&
                      'font-bold text-gray-900',
                  ]"
                  :style="{
                    maxWidth: evSize,
                    textOverflow: 'ellipsis',
                  }"
                >
                  {{ species.pokemon.name }}
                </div>
              </g-link>
            </div>
            <div
              v-if="i != buckets.length - 1"
              :key="i"
              class="flex p-2 items-center"
            >
              &gt;
            </div>
          </template>
        </div>
      </template>
    </div>
    <!-- Background color -->
    <div
      class="fixed inset-0"
      :style="{
        zIndex: -1,
        backgroundColor: bgColor,
        filter: 'opacity(0.3)',
      }"
    />
  </div>
</template>

<script>
import PokeTypeChip from "~/components/PokeTypeChip";
import PokeListCard from "../components/PokeListCard";
import { get } from "lodash";
import PokeBall from "../components/PokeBall";

export default {
  components: { PokeTypeChip, PokeListCard, PokeBall },

  /**
   * Page data
   */
  data() {
    return {
      isMounted: false,
      evSize: "100px",
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
      const prefix = "Light";

      const rgb = get(
        this.$page,
        `pokemon.species.colorPalette.${prefix}Vibrant.rgb`,
      ) ||
        get(this.$page, "pokemon.species.colorPalette.Vibrant.rgb") || [
          0,
          0,
          0,
        ];
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    },
    // Background color for the pokemon
    bgColor() {
      const prefix = "Light";

      const rgb = get(
        this.$page,
        `pokemon.species.colorPalette.LightVibrant.rgb`,
      ) ||
        get(this.$page, `pokemon.species.colorPalette.Vibrant.rgb`) ||
        get(this.$page, `pokemon.species.colorPalette.LightMuted.rgb`) || [
          200,
          200,
          200,
        ];
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
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
      return !this.isMounted;
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

    // Key listener
    keydownHandler(e) {
      if (/arrowright/i.test(e.key) || /^k$/i.test(e.key)) {
        this.$router.push(this.nextLink);
      } else if (/arrowleft/i.test(e.key) || /^j$/i.test(e.key)) {
        this.$router.push(this.prevLink);
      }
    },
  },

  /**
   * On mount, mark that we're mounted. (For display purposes...)
   */
  mounted() {
    this.isMounted = true;
    window.addEventListener("keydown", this.keydownHandler);
  },

  beforeDestroy() {
    window.removeEventListener("keydown", this.keydownHandler);
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

<style scoped>
.evLink:hover .evImg {
  filter: drop-shadow(1px 1px 2px rgba(50, 50, 50, 0.7));
}
</style>

<page-query>
  query ($id: ID!) {
    pokemon(id: $id) {
      id,
      name,
      types { id, name, slug }
      weight
      height
      stats { base, name }
      prev_pokemon { name, slug }
      next_pokemon { name, slug }
      species {
        flavor_text, color,
        colorPalette {
          Vibrant { rgb }
          Muted { rgb }
          DarkVibrant { rgb }
          LightVibrant { rgb }
          DarkMuted { rgb }
          LightMuted { rgb }
        }
        evolution_chain {
          links {
            species {
              pokemon {
                id, name, slug,
                species {
                  colorPalette {
                    Vibrant { rgb }
                    DarkMuted { rgb }
                    DarkVibrant { rgb }
                    LightVibrant { rgb }
                    LightMuted { rgb }
                  }
                }
              }
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
