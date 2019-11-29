<template>
  <Layout>
    <content-wrapper>
      <div class="display-1 mb-2">Types</div>
      <v-row dense>
        <v-col
          v-for="edge in $page.allType.edges"
          :key="edge.node.id"
          cols="6"
          sm="4"
          md="3"
        >
          <poke-type-chip :type="edge.node" block></poke-type-chip>
        </v-col>
      </v-row>
    </content-wrapper>
  </Layout>
</template>

<script>
import PokeTypeChip from "../components/PokeTypeChip";
export default {
  components: { PokeTypeChip },

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
