<template>
  <v-content>
    <v-container>
      <v-row>
        <v-col v-for="pokemon in sortedPokemon" :key="pokemon.id" cols="6">
          <g-link :to="`/${pokemon.slug}`" style="text-decoration: none;">
            <v-card
              class="fill-height"
              :style="{
                borderBottom: `2px solid ${getPrimaryColor(pokemon)}`,
              }"
              :dark="$vuetify.theme.dark"
            >
              <div
                :style="{
                  background: `linear-gradient(to ${
                    $vuetify.breakpoint.xsOnly ? 'top' : 'left'
                  }, ${getDarkerBgColor(pokemon)} 50%, ${getBgColor(pokemon)})`,
                  zIndex: 0,
                }"
                class="pa-3"
              >
                <v-row>
                  <v-col cols="12" md="4" class="d-flex justify-center">
                    <v-img
                      :src="`/img/pokemon/${pokemon.id}.svg`"
                      :aspect-ratio="1"
                      contain
                      :alt="`Image of ${pokemon.name}`"
                      width="100%"
                      max-width="200px"
                    >
                      <template v-slot:placeholder>
                        <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                        >
                          <v-progress-circular
                            indeterminate
                            color="grey lighten-5"
                          />
                        </v-row>
                      </template>
                    </v-img>
                  </v-col>
                  <v-col>
                    <div
                      class="font-weight-bold title overflow-hidden"
                      style="white-space: nowrap; text-overflow: ellipsis;"
                    >
                      {{ pokemon.name }} (#{{ pokemon.id }})
                    </div>
                    <!-- Description -->
                    <div
                      class="d-none d-sm-block"
                      v-html="pokemon.species.flavor_text"
                    />
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </g-link>
        </v-col>
        <ClientOnly>
          <v-col cols="6">
            <infinite-loading @infinite="infiniteHandler" spinner="spiral">
              <div slot="no-more" class="d-none"></div>
              <div slot="no-results" class="d-none"></div>
            </infinite-loading>
          </v-col>
        </ClientOnly>
      </v-row>
    </v-container>
  </v-content>
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
      const prefix = this.$vuetify.theme.dark ? "Dark" : "Light";
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
