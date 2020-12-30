<template>
  <div v-touch:swipe.left="swipeLeft" v-touch:swipe.right="swipeRight">
    <div class="container max-w-2xl py-6 px-2">
      <div class="grid sm:grid-cols-2 gap-12">
        <div>
          <div
            class="w-3/4 sm:w-full relative mx-auto"
            style="padding-top: 100%"
          >
            <div class="absolute inset-0">
              <PokeImg
                :id="$page.pokemon.id"
                :name="$page.pokemon.name"
                img-class="w-full h-full object-contain"
                :img-style="{
                  filter: 'drop-shadow(2px 2px 2px rgba(50, 50, 50, 0.8))',
                }"
              />
            </div>
            <div
              class="absolute left-0 bottom-0 text-6xl text-gray-700 font-fancy font-thin"
              :style="{
                color,
                filter: `drop-shadow(2px 2px 2px rgba(50, 50, 50, 0.8))`,
              }"
            >
              #{{ $page.pokemon.id }}
            </div>
          </div>
        </div>
        <div>
          <div class="text-6xl leading-snug font-fancy">
            {{ $page.pokemon.name }}
          </div>
          <div class="flex -mx-1 mb-3">
            <poke-type-chip
              v-for="type in $page.pokemon.types"
              :key="type.slug"
              :type="type"
              class="mx-1"
            />
          </div>
          <!-- Weight/height -->
          <div class="flex mb-2 text-gray-800">
            <div class="mr-5 flex items-center">
              <font-awesome-icon icon="ruler-vertical" class="mr-2" />
              <span class="">{{ $page.pokemon.height }} ft</span>
            </div>
            <div class="flex items-center">
              <font-awesome-icon icon="weight" class="mr-2" />
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
          <div class="flex flex-wrap">
            <poke-type-chip
              v-for="factor in damageFactors"
              :key="factor.type.slug"
              :type="factor.type"
              small
              :starred="factor.factor > 3.9"
              class="mr-1 mb-1"
            />
          </div>
        </div>
      </div>
      <div class="mb-12"></div>
      <div class="grid sm:grid-cols-4 gap-12">
        <div>
          <div class="text-xl font-bold mb-4">Stats</div>
          <div class="w-32 mx-auto">
            <div class="w-full relative" style="padding-top: 100%">
              <div class="absolute inset-0 text-gray-700">
                <poke-stat-chart
                  :pokemon="$page.pokemon"
                  :color="color"
                  :bg-color="bgColor"
                />
              </div>
            </div>
          </div>
        </div>
        <div v-if="isPartOfChain" class="sm:col-span-3 flex flex-col">
          <div class="text-xl font-bold mb-4">Evolutions</div>
          <div class="flex gap-2 flex-col sm:flex-row items-center flex-grow">
            <template v-for="(bucket, i) in buckets">
              <div
                :key="bucket[0].pokemon.slug"
                :style="{ width: evSize, height: evSize }"
                class="overflow-y-auto overflow-x-hidden grid gap-2"
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
                    >
                      <PokeImg
                        :id="species.pokemon.id"
                        :name="species.pokemon.name"
                        img-class="w-full h-full object-contain"
                      />
                    </div>
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
                <font-awesome-icon
                  icon="chevron-right"
                  class="hidden sm:block"
                />
                <font-awesome-icon
                  icon="chevron-down"
                  class="block sm:hidden"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="mb-12"></div>
      <div class="flex justify-between text-sm text-gray-700">
        <g-link
          class="border-2 w-32 rounded flex justify-center items-center border-gray-700 hover:font-bold"
          :to="prevLink"
        >
          <span class="p-2 pr-0">
            <font-awesome-icon icon="chevron-left" />
          </span>
          <span
            class="flex-grow flex justify-center p-2 overflow-hidden whitespace-no-wrap"
            >{{ _get($page, "pokemon.prev_pokemon.name", "Pokedex") }}</span
          >
        </g-link>
        <g-link
          class="border-2 w-32 rounded flex justify-center items-center border-gray-700 hover:font-bold"
          :to="nextLink"
        >
          <span
            class="flex-grow flex justify-center p-2 overflow-hidden whitespace-no-wrap"
            >{{ _get($page, "pokemon.next_pokemon.name", "Pokedex") }}</span
          >
          <span class="p-2 pl-0">
            <font-awesome-icon icon="chevron-right" class="ml-2" />
          </span>
        </g-link>
      </div>
    </div>
  </div>
</template>

<script>
import PokeTypeChip from "~/components/PokeTypeChip";
import PokeListCard from "../components/PokeListCard";
import { get } from "lodash";
import tinycolor from "tinycolor2";
import PokeBall from "../components/PokeBall";
import { setBackgroundColor } from "../util/setBackgroundColor";
import PokeStatChart from "../components/PokeStatChart";
import PokeImg from "../components/PokeImg";

export default {
  name: "Pokemon",

  components: { PokeImg, PokeTypeChip, PokeListCard, PokeBall, PokeStatChart },

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
      const [r, g, b] = get(
        this.$page,
        `pokemon.species.colorPalette.LightVibrant.rgb`,
      ) ||
        get(this.$page, `pokemon.species.colorPalette.Vibrant.rgb`) ||
        get(this.$page, `pokemon.species.colorPalette.LightMuted.rgb`) || [
          200,
          200,
          200,
        ];

      return tinycolor(`rgb(${r}, ${g}, ${b})`).toRgbString();
    },
    // Background color for the pokemon
    bgColor() {
      const [r, g, b] = get(
        this.$page,
        `pokemon.species.colorPalette.LightVibrant.rgb`,
      ) ||
        get(this.$page, `pokemon.species.colorPalette.Vibrant.rgb`) ||
        get(this.$page, `pokemon.species.colorPalette.LightMuted.rgb`) || [
          200,
          200,
          200,
        ];

      return tinycolor.mix(`rgb(${r}, ${g}, ${b})`, "white", 80).toRgbString();
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

    setHeaderColor() {
      setBackgroundColor(this.bgColor);
    },

    // Swipe handlers
    swipeLeft() {
      this.$router.push(this.nextLink);
    },
    swipeRight() {
      this.$router.push(this.prevLink);
    },
  },

  watch: {
    $route() {
      this.setHeaderColor();
    },
  },

  /**
   * On mount, mark that we're mounted. (For display purposes...)
   */
  mounted() {
    this.isMounted = true;
    window.addEventListener("keydown", this.keydownHandler);

    this.setHeaderColor();
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
