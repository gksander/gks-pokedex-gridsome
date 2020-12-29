<template>
  <div class="container max-w-2xl py-6 px-2">
    <div class="mb-12">
      <div class="text-5xl font-fancy">Grant's Pokedex</div>
      <div>
        A list of all pokemon (through generation 5), proudly powered by
        <a
          href="https://github.com/PokeAPI/pokeapi"
          target="_blank"
          rel="noreferrer"
          class="text-primary-800"
          >the Open PokeAPI</a
        >
        and
        <a
          href="https://github.com/jnovack/pokemon-svg"
          target="_blank"
          rel="noreferrer"
          class="text-primary-800"
          >pokemon-svg</a
        >. Built with
        <a
          href="https://gridsome.org/"
          target="_blank"
          rel="noreferrer"
          class="text-primary-800"
          >Gridsome.js</a
        >
        and styled with the almighty
        <a
          href="https://tailwindcss.com/"
          target="_blank"
          rel="noreferrer"
          class="text-primary-800"
          >TailwindCSS</a
        >. Check out
        <a
          href="https://github.com/gksander/gks-pokedex-gridsome"
          target="_blank"
          rel="noreferrer"
          class="text-primary-800"
          >the source code</a
        >
        on GitHub.
      </div>
    </div>
    <div class="grid gap-16">
      <poke-list-card
        v-for="pokemon in sortedPokemon"
        :key="pokemon.id"
        :pokemon="pokemon"
      />

      <ClientOnly>
        <infinite-loading @infinite="infiniteHandler" spinner="spiral">
          <div slot="no-more" class="d-none"></div>
          <div slot="no-results" class="d-none"></div>
        </infinite-loading>
      </ClientOnly>
    </div>
  </div>
</template>

<script>
import PokeListCard from "../components/PokeListCard";
import PokeTypeChip from "../components/PokeTypeChip";
import uniqBy from "lodash/uniqBy";
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
          this.loadedPokemon = uniqBy(
            [...this.loadedPokemon, ...data.allPokemon.edges],
            p => p?.node?.id,
          );
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
