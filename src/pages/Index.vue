<template>
  <Layout>
    <div
      v-for="edge in $page.allPokemon.edges"
      :key="edge.node.id"
      class="mb-2 p-3"
    >
      <g-link :to="`/pokemon/${edge.node.id}`"
        >{{ edge.node.id }} - {{ edge.node.name }}</g-link
      >
    </div>
  </Layout>
</template>

<script>
export default {
  metaInfo: {
    title: "Hello, world!",
  },
};
</script>

<page-query>
query {
  allPokemon (order: ASC) {
    edges {
      node {
        id,
        name
      }
    }
  }
}
</page-query>
