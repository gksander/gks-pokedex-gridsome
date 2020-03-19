<template>
  <v-content>
    <v-container>
      <v-row>
        <v-col
          v-for="pokemon in sortedPokemon"
          :key="pokemon.id"
          cols="12"
          md="6"
        >
          <g-link :to="`/${pokemon.slug}`" style="text-decoration: none;">
            <v-card class="fill-height" :style="{
            	borderBottom: `2px solid ${getPrimaryColor(pokemon)}`,
            }">
              <div
                :style="{
                  background: `linear-gradient(to ${
                    $vuetify.breakpoint.xsOnly ? 'top' : 'left'
                  }, transparent 50% 75%, ${getBgColor(pokemon)})`,
                  zIndex: 0,
                }"
                class="pa-3"
              >
                <v-row>
                  <v-col cols="12" sm="4" class="d-flex justify-center">
                    <v-hover v-slot="{ hover }">
                      <v-img
                        :src="`/img/pokemon/${pokemon.id}.svg`"
                        :aspect-ratio="1"
                        :width="hover ? '100%' : '95%'"
                        contain
                        :alt="`Image of ${pokemon.name}`"
                      />
                    </v-hover>
                  </v-col>
                  <v-col>
                    <div class="font-weight-bold title white--text">
                      {{ pokemon.name }} (#{{ pokemon.id }})
                    </div>
                    <!-- Description -->
                    <div v-html="pokemon.species.flavor_text" />
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </g-link>
        </v-col>
        <ClientOnly>
          <v-col cols="12" sm="6">
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
      const rgb =
        get(pokemon, "species.colorPalette.DarkMuted.rgb") ||
        get(pokemon, "species.colorPalette.DarkVibrant.rgb");
      return rgb
        ? `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
        : this.$vuetify.theme.themes.dark.secondary;
    },

    // Get pokemon's vibrant color
    getPrimaryColor(pokemon) {
      const rgb =
        get(pokemon, "species.colorPalette.LightVibrant.rgb") ||
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
      }
    }
  }
}
</page-query>
