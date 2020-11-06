<template>
  <div class="container max-w-2xl py-6 px-2">
    <div class="grid gap-16">
      <div
        v-for="pokemon in sortedPokemon"
        :key="pokemon.id"
        class="grid sm:grid-cols-4 gap-6"
      >
        <div class="sm:col-span-1 flex justify-center">
          <div class="w-56 sm:w-full card">
            <div class="relative" style="padding-top: 100%">
              <div class="absolute inset-0">
                <div
                  :style="{
                    color: getPokeballColor(pokemon),
                  }"
                  class="p-2"
                >
                  <poke-ball class="pokeball transition-all duration-300" />
                </div>
                <g-link
                  class="absolute inset-0 image transition-all duration-300"
                  :style="{
                    backgroundImage: `url('/img/pokemon/${pokemon.id}.svg')`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                  }"
                  :to="`/${pokemon.slug}`"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="sm:col-span-3 sm:pt-3">
          <div class="flex justify-between items-baseline">
            <g-link
              :to="`/${pokemon.slug}`"
              class="font-bold text-2xl text-gray-800 hover:text-primary-800 transition-colors duration-150"
            >
              {{ pokemon.name }}</g-link
            >
            <span class="text-gray-600 text-xl font-bold"
              >#{{ pokemon.id }}</span
            >
          </div>
          <div
            v-html="pokemon.species.flavor_text"
            class="text-gray-700 mb-2"
          />
          <div class="flex gap-x-2">
            <poke-type-chip
              v-for="type in pokemon.types"
              :key="type.slug"
              :type="type"
            />
          </div>
        </div>
      </div>
      <infinite-loading @infinite="infiniteHandler" spinner="spiral">
        <div slot="no-more" class="d-none"></div>
        <div slot="no-results" class="d-none"></div>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import PokeListCard from "../components/PokeListCard";
import PokeTypeChip from "../components/PokeTypeChip";
import { get } from "lodash";
import tinycolor from "tinycolor2";
import PokeBall from "../components/PokeBall";

export default {
  components: { PokeListCard, PokeTypeChip, PokeBall },

  /**
   * Keep track of the pokemon we loaded in
   */
  data() {
    return {
      loadedPokemon: [],
      currentPage: 1,
    };
  },

  /**
   * Computed props
   */
  computed: {
    sortedPokemon() {
      return this.loadedPokemon
        .sort((a, b) => parseInt(a.node.id) - parseInt(b.node.id))
        .map(edge => edge.node);
    },
  },

  /**
   * On creation, add initial pokemon to our list
   */
  created() {
    this.loadedPokemon = this.$page.allPokemon.edges;
  },

  /**
   * Methods
   */
  methods: {
    /**
     * Handler for the infinite scroll component
     */
    async infiniteHandler($state) {
      // If next page doesn't exist, break.
      if (this.currentPage + 1 > this.$page.allPokemon.pageInfo.totalPages) {
        $state.complete();
      } else {
        // Fetch data from the next page
        const { data } = await this.$fetch(`/${this.currentPage + 1}`);
        // If we've got data, add it to our list
        if (data.allPokemon.edges.length) {
          this.currentPage = data.allPokemon.pageInfo.currentPage;
          this.loadedPokemon.push(...data.allPokemon.edges);
          $state.loaded();
        } else {
          // No more data - we're done
          $state.complete();
        }
      }
    },

    getPokeballColor(pokemon) {
      const rgb =
        get(pokemon, `species.colorPalette.LightMuted.rgb`) ||
        get(pokemon, `species.colorPalette.LightVibrant.rgb`);
      return rgb
        ? `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.5)`
        : "rgba(0,0,0,0.5)";
      // const { _r, _g, _b } = tinycolor(bgColor)["lighten"](20);
    },
  },

  /**
   * Page meta
   */
  metaInfo() {
    return {
      title: "Pokemon",
      meta: [{ name: "description", content: "Pokemon listing" }],
    };
  },
};
</script>

<style scoped>
.card:hover .image {
  cursor: pointer;
  filter: drop-shadow(1px 1px 2px rgba(50, 50, 50, 0.6));
}
.card:hover .pokeball {
  transform: scale(1.3) rotate(180deg);
}
</style>

<page-query>
query ($page: Int) {
  allPokemon (sortBy: "id", order: ASC, perPage: 25, page: $page) @paginate {
    totalCount
    pageInfo { totalPages, currentPage }
    edges {
      node {
        id,
        name,
        slug,
        species {
          flavor_text
          colorPalette {
            Vibrant { rgb }
            DarkVibrant { rgb }
            LightVibrant { rgb }
            DarkMuted { rgb }
          }
        }
        types { slug, name }
      }
    }
  }
}
</page-query>
