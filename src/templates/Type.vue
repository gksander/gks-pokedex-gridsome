<template>
  <Layout>
    <content-wrapper>
      <div class="display-2 mb-2">{{ $page.type.name }}</div>
      <v-row>
        <v-col
          v-for="cat in damageCategories"
          :key="cat.title"
          cols="12"
          sm="4"
        >
          <v-card>
            <v-card-title class="pb-2">{{ cat.title }}</v-card-title>
            <v-card-text>
              <template v-if="cat.types.length">
                <v-row dense>
                  <v-col v-for="type in cat.types" :key="type.name" cols="12">
                    <poke-type-chip :type="type" block small></poke-type-chip>
                  </v-col>
                </v-row>
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
          v-for="edge in loadedPokemon"
          :key="edge.node.id"
          cols="6"
          sm="4"
          md="3"
        >
          <poke-list-card :pokemon="edge.node"></poke-list-card>
        </v-col>
        <ClientOnly>
          <v-col cols="6" sm="4" md="3">
            <infinite-loading
              @infinite="infiniteHandler"
              spinner="spiral"
              ref="infiniteLoader"
            >
              <div slot="no-more" class="d-none">No more!</div>
              <div slot="no-results">No pokemon...</div>
            </infinite-loading>
          </v-col>
        </ClientOnly>
      </v-row>
    </content-wrapper>
  </Layout>
</template>

<script>
import PokeTypeChip from "../components/PokeTypeChip";
import PokeListCard from "../components/PokeListCard";
export default {
  metaInfo() {
    return {
      title: this.$page.type.name,
      meta: [
        {
          name: "Description",
          content: `Details for type ${this.$page.type.name}`,
        },
      ],
    };
  },

  components: { PokeTypeChip, PokeListCard },

  data() {
    return {
      loadedPokemon: [],
      currentPage: 1,
    };
  },

  created() {
    this.loadedPokemon.push(...this.$page.type.belongsTo.edges);
  },

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
    async infiniteHandler($state) {
      if (
        this.currentPage + 1 >
        this.$page.type.belongsTo.pageInfo.totalPages
      ) {
        $state.complete();
      } else {
        const { data } = await this.$fetch(
          `/types/${this.$page.type.slug}/${this.currentPage + 1}`,
        );
        if (data.type.belongsTo.edges.length) {
          this.currentPage = data.type.belongsTo.pageInfo.currentPage;
          this.loadedPokemon.push(...data.type.belongsTo.edges);
          $state.loaded();
        } else {
          $state.complete();
        }
      }
    },
  },

  watch: {
    "$page.type.slug"() {
      this.currentPage = 1;
      this.loadedPokemon = this.$page.type.belongsTo.edges;
      try {
        this.$refs.infiniteLoader.stateChanger.reset();
      } catch (_) {
        console.log(_);
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
      sortBy: "id", order: ASC, perPage: 20, page: $page
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
