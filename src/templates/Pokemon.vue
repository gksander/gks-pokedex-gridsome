<template>
  <div>
    Pokemon details
  </div>
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
        `pokemon.species.colorPalette.${prefix}Muted.rgb`,
      ) ||
        get(
          this.$page,
          `pokemon.species.colorPalette.${prefix}Vibrant.rgb`,
        ) || [0, 0, 0];
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
