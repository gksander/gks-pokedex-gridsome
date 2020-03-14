<template>
  <content-wrapper>
    <v-row >
      <v-col
        v-for="pokemon in sortedPokemon"
        :key="pokemon.node.id"
        cols="6"
        sm="4"
        md="3"
      >
        <poke-list-card :pokemon="pokemon.node"></poke-list-card>
      </v-col>
      <ClientOnly>
        <v-col cols="6" sm="4" md="3">
          <infinite-loading @infinite="infiniteHandler" spinner="spiral">
            <div slot="no-more" class="d-none"></div>
            <div slot="no-results" class="d-none"></div>
          </infinite-loading>
        </v-col>
      </ClientOnly>
    </v-row>
  </content-wrapper>
</template>

<script>
import PokeListCard from "../components/PokeListCard";
export default {
  components: { PokeListCard },

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
      return this.loadedPokemon.sort(
        (a, b) => parseInt(a.node.id) - parseInt(b.node.id),
      );
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
        png (width: 150, height: 150, fit: contain, background: "transparent"),
        species {
          colorPalette {
            Vibrant { rgb }
          }
        }
      }
    }
  }
}
</page-query>
