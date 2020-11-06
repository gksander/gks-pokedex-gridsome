<template>
  <div class="grid gap-8">
    <div
      v-for="pokemon in sortedPokemon"
      :key="pokemon.id"
      class="grid grid-cols-4 gap-4"
    >
      <div class="col-span-1">
        <img :src="`/img/pokemon/${pokemon.id}.svg`" :alt="pokemon.name" />
      </div>
      <div class="col-span-3">
        <g-link :to="`/${pokemon.slug}`" class="font-bold text-xl"
          >{{ pokemon.name }} (#{{ pokemon.id }})</g-link
        >
        <div v-html="pokemon.species.flavor_text" />
        <div>
          <g-link
            v-for="type in pokemon.types"
            :key="type.slug"
            :to="`/types/${type.slug}`"
          >
            {{ type.name }}
          </g-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PokeListCard from "../components/PokeListCard";
import PokeTypeChip from "../components/PokeTypeChip";
import { get } from "lodash";
import tinycolor from "tinycolor2";

export default {
  components: { PokeListCard, PokeTypeChip },

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

    // Get pokemon's BG color
    getBgColor(pokemon) {
      const prefix = "Dark";
      const rgb =
        get(pokemon, `species.colorPalette.${prefix}Muted.rgb`) ||
        get(pokemon, `species.colorPalette.${prefix}Vibrant.rgb`);
      return rgb ? `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` : "white";
    },

    getDarkerBgColor(pokemon) {
      const bgColor = this.getBgColor(pokemon);
      const { _r, _g, _b } = tinycolor(bgColor)["lighten"](20);
      return `rgb(${_r}, ${_g}, ${_b})`;
    },

    // Get pokemon's vibrant color
    getPrimaryColor(pokemon) {
      const prefix = "Light";

      const rgb =
        get(pokemon, `species.colorPalette.${prefix}Vibrant.rgb`) ||
        get(pokemon, "species.colorPalette.Vibrant.rgb");
      return rgb ? `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` : "black";
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
