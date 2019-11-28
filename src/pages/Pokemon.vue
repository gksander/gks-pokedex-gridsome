<template>
  <Layout>
    <v-row>
      <v-col
        v-for="edge in $page.allPokemon.edges"
        :key="edge.node.id"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <poke-list-card :pokemon="edge.node"></poke-list-card>
      </v-col>
    </v-row>
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
        sprite_front(width: 150, height: 150, fit: contain),
      }
    }
  }
}
</page-query>
