<template>
  <Layout>
    <div class="-mx-2 flex flex-wrap flex-row">
      <div
        v-for="edge in $page.allPokemon.edges"
        :key="edge.node.id"
        class="p-2 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6"
      >
        <poke-list-card :pokemon="edge.node"></poke-list-card>
      </div>
    </div>
  </Layout>
</template>

<script>
import PokeListCard from "~/components/PokeListCard";
export default {
  components: { PokeListCard },
  metaInfo: {
    title: "Pokemon",
  },
};
</script>

<page-query>
query {
  allPokemon (sortBy: "id", order: ASC) {
    edges {
      node {
        id,
        name,
        sprite_front(width: 96, height: 96, background: "contain"),
        types
      }
    }
  }
}
</page-query>
