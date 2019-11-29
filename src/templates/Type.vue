<template>
  <Layout>
    <content-wrapper style="padding-bottom: 60px">
      <div class="display-2 mb-2">{{ $page.type.name }}</div>
      <v-row>
        <v-col
          v-for="cat in damageCategories"
          :key="cat.title"
          cols="12"
          sm="4"
        >
          <v-card>
            <v-card-title>{{ cat.title }}</v-card-title>
            <v-card-text>
              <template v-if="cat.types.length">
                <poke-type-chip
                  v-for="type in cat.types"
                  :key="type.name"
                  :type="type"
                  block
                  class="mb-2"
                ></poke-type-chip>
              </template>
              <template v-else>
                <div class="font-italic">Nothing...</div>
              </template>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-divider class="my-6"></v-divider>

      <!-- Pokemon of this type... -->
      <v-row>
        <v-col
          v-for="edge in $page.type.belongsTo.edges"
          :key="edge.node.id"
          cols="6"
          sm="4"
          md="3"
        >
          <poke-list-card :pokemon="edge.node"></poke-list-card>
        </v-col>
      </v-row>
    </content-wrapper>

    <bottom-bar>
      <v-pagination
        :length="$page.type.belongsTo.pageInfo.totalPages"
        :value="$page.type.belongsTo.pageInfo.currentPage"
        @input="navigateToPage"
        prev-icon="fa-chevron-left fa-xs"
      ></v-pagination>
    </bottom-bar>
  </Layout>
</template>

<script>
import PokeTypeChip from "../components/PokeTypeChip";
import PokeListCard from "../components/PokeListCard";
export default {
  metaInfo() {
    return {
      title: this.$page.type.name,
    };
  },

  components: { PokeTypeChip, PokeListCard },

  computed: {
    // Types this type is strong against
    superEffectiveAgainst() {
      return this.$page.allDamageFactor.edges
        .filter(edge => edge.node.damage_factor == 200)
        .map(edge => edge.node.target_type);
    },
    // Types this type is week against
    notVeryEffectiveAgainst() {
      return this.$page.allDamageFactor.edges
        .filter(edge => edge.node.damage_factor == 50)
        .map(edge => edge.node.target_type);
    }, // Types this type is week against
    notEffectiveAgainst() {
      return this.$page.allDamageFactor.edges
        .filter(edge => edge.node.damage_factor == 0)
        .map(edge => edge.node.target_type);
    },
    // Damage categories
    damageCategories() {
      return [
        {
          title: "Strong Against",
          types: this.superEffectiveAgainst,
        },
        {
          title: "Weak Against",
          types: this.notVeryEffectiveAgainst,
        },
        { title: "Doesn't Effect", types: this.notEffectiveAgainst },
      ];
    },
  },

  methods: {
    navigateToPage(page) {
      if (page == 1) {
        this.$router.push(`/types/${this.$page.type.slug}/`);
      } else {
        this.$router.push(`/types/${this.$page.type.slug}/${page}`);
      }
    },
  },
};
</script>

<page-query>
query ($id: ID!, $page: Int) {
  type (id: $id) {
    id, name, slug,
    belongsTo(
      filter: { typeName: { eq: Pokemon } },
      sortBy: "id", order: ASC, perPage: 8, page: $page
    ) @paginate {
      pageInfo { hasPreviousPage, hasNextPage, totalPages, currentPage }
      edges {
        node {
          ... on Pokemon {
            id, slug, name,
            png (width: 150, height: 150, fit: contain, background: "transparent"),
          }
        }
      }
    }
  }
  allDamageFactor(filter: { damage_type: { eq: $id } }) {
    edges {
      node {
        target_type { id, name, slug }
        damage_factor
      }
    }
  }
}
</page-query>
