<template>
  <Layout>
    <content-wrapper style="padding-bottom: 60px">
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

    <div
      :style="{
        position: 'fixed',
        bottom: 0,
        left: `${$vuetify.application.left}px`,
        right: $vuetify.application.right,
        height: '60px',
        background: 'rgba(255,255,255,0.9)',
      }"
      class="d-flex align-center elevation-3"
    >
      <v-pagination
        :length="$page.allPokemon.pageInfo.totalPages"
        :value="$page.allPokemon.pageInfo.currentPage"
        @input="navigateToPage"
        prev-icon="fa-chevron-left fa-xs"
      ></v-pagination>
    </div>
  </Layout>
</template>

<script>
import PokeListCard from "../components/PokeListCard";
export default {
  components: { PokeListCard },

  computed: {
    prevLink() {
      const pageNum = this.$page.allPokemon.pageInfo.currentPage - 1;
      return pageNum == 1 ? "/pokemon" : `/pokemon/${pageNum}`;
    },
    nextLink() {
      const pageNum = this.$page.allPokemon.pageInfo.currentPage + 1;
      return `/pokemon/${pageNum}`;
    },
  },

  methods: {
    navigateToPage(page) {
      if (page == 1) {
        this.$router.push("/pokemon");
      } else {
        this.$router.push(`/pokemon/${page}`);
      }
    },
  },

  mounted() {
    console.log(this.$vuetify);
  },
};
</script>

<page-query>
query ($page: Int) {
  allPokemon (sortBy: "id", order: ASC, perPage: 50, page: $page) @paginate {
  totalCount
  pageInfo { hasPreviousPage, hasNextPage, totalPages, currentPage }
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
