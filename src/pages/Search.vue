<template>
  <div class="container max-w-2xl px-2 py-6">
    Search coming soon...
  </div>
</template>

<script>
import PokeTypeChip from "../components/PokeTypeChip";

export default {
  components: { PokeTypeChip },

  /**
   * Component data
   */
  data() {
    return {
      query: "",
    };
  },

  /**
   * Page meta
   */
  metaInfo() {
    return {
      title: "Search Pokemon",
      meta: [{ name: "description", content: "Pokemon listing" }],
    };
  },
};
</script>

<page-query>
query {
  allPokemon(sortBy: "id", order: ASC) {
    edges {
      node {
        id, name, slug,
        types { id, name, slug }
      }
    }
  }
}
</page-query>
