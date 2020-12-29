<template>
  <div class="container max-w-2xl py-6 px-2">
    <div class="text-3xl font-bold">Types</div>
    <div class="mb-4 text-gray-700">Select a type to learn more about it.</div>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
      <poke-type-chip
        v-for="type in allTypes"
        :key="type.id"
        :type="type"
        block
      />
    </div>
  </div>
</template>

<script>
import PokeTypeChip from "../components/PokeTypeChip";
export default {
  components: { PokeTypeChip },

  computed: {
    allTypes() {
      return this.$page.allType.edges.map(edge => edge.node);
    },
  },

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
