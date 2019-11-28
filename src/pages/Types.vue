<template>
  <Layout>
    <content-wrapper>
      <div class="display-1 mb-2">Types</div>
      <v-row>
        <v-col
          v-for="edge in $page.allType.edges"
          :key="edge.node.id"
          cols="12"
          sm="6"
          lg="4"
        >
          <v-hover v-slot:default="{ hover }">
            <v-card :elevation="hover ? 4 : 1" :to="`/types/${edge.node.slug}`">
              <v-card-title>
                {{ edge.node.name }}
                <v-spacer></v-spacer>
                <poke-type-chip :type="edge.node"></poke-type-chip>
              </v-card-title>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </content-wrapper>
  </Layout>
</template>

<script>
import PokeTypeChip from "../components/PokeTypeChip";
export default {
  components: { PokeTypeChip },
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
