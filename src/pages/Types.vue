<template>
  <div>
    Types list...
  </div>
</template>

<script>
import PokeTypeChip from "../components/PokeTypeChip";
export default {
  components: { PokeTypeChip },

  /**
   * Page meta
   */
  metaInfo() {
    return {
      title: "Types",
      meta: [{ name: "description", content: "Pokemon Types listing" }],
    };
  },
};
</script>

<page-query>
query {
  allType (sortBy: "id", order: ASC) {
    edges {
      node {
        id,
        name,
        slug,
      }
    }
  }
}
</page-query>
