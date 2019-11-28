<template>
  <Layout>
    <content-wrapper>
      <div class="display-1 mb-2">Pokemon</div>
      <v-row>
        <v-col
          v-for="edge in $page.allPokemon.edges"
          :key="edge.node.id"
          cols="6"
          sm="4"
          md="3"
        >
          <poke-list-card :pokemon="edge.node"></poke-list-card>
        </v-col>
      </v-row>
    </content-wrapper>
  </Layout>
</template>

<script>
import PokeListCard from "../components/PokeListCard";
export default {
  components: { PokeListCard },
};
</script>

<page-query>
query {
  allPokemon (sortBy: "id", order: ASC) {
    edges {
      node {
        id,
        name,
        slug,
        png (width: 150, height: 150, fit: contain, background: "transparent"),
      }
    }
  }
}
</page-query>
