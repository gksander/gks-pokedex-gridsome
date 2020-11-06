<template>
  <div>
    Not really being used...
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
      const prefix = "Light";
      const rgb =
        get(pokemon, `species.colorPalette.${prefix}Muted.rgb`) ||
        get(pokemon, `species.colorPalette.${prefix}Vibrant.rgb`);
      return rgb
        ? `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
        : this.$vuetify.theme.themes.dark.secondary;
    },

    getDarkerBgColor(pokemon) {
      const bgColor = this.getBgColor(pokemon);
      const { _r, _g, _b } = tinycolor(bgColor)[
        this.$vuetify.theme.dark ? "darken" : "lighten"
      ](20);
      return `rgb(${_r}, ${_g}, ${_b})`;
    },

    // Get pokemon's vibrant color
    getPrimaryColor(pokemon) {
      const prefix = this.$vuetify.theme.dark ? "Light" : "Dark";

      const rgb =
        get(pokemon, `species.colorPalette.${prefix}Vibrant.rgb`) ||
        get(pokemon, "species.colorPalette.Vibrant.rgb");
      return rgb
        ? `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
        : this.$vuetify.theme.themes.dark.primary;
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
allPokemon (sortBy: "id", order: ASC, perPage: 20, page: $page) @paginate {
totalCount
pageInfo { totalPages, currentPage }
edges {
node {
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
}
}
</page-query>
