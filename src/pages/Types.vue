<template>
  <Layout>
    <div class="display-1">Types</div>
    <v-row>
      <v-col
        v-for="edge in $page.allType.edges"
        :key="edge.node.id"
        cols="6"
        sm="4"
      >
        <v-card :to="`/types/${edge.node.slug}`">
          <v-card-text>{{ edge.node.name }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </Layout>
</template>

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
