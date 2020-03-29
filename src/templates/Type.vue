<template>
  <content-wrapper>
    <div class="display-2 mb-2">{{ $page.type.name }}</div>
    <v-row>
      <v-col v-for="cat in damageCategories" :key="cat.title" cols="12" sm="4">
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
        v-for="edge in sortedPokemon"
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
            <div slot="no-results" class="d-none">No pokemon...</div>
          </infinite-loading>
        </v-col>
      </ClientOnly>
    </v-row>
  </content-wrapper>
</template>

<script>
import PokeTypeChip from "../components/PokeTypeChip";
import PokeListCard from "../components/PokeListCard";
export default {
  components: { PokeTypeChip, PokeListCard },

  /**
   * Data - keep track of loaded-in pokemon
   */
  data() {
    return {
      loadedPokemon: [],
      currentPage: 1,
    };
  },

  /**
   * On creation we need to add the initial pokemon to our list
   */
  created() {
    this.loadedPokemon = this.$page.type.belongsTo.edges;
  },

  /**
   * Computed props
   */
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
    },
    // Types this type doesn't affect
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
    // Sort by ID
    sortedPokemon() {
      return this.loadedPokemon.sort(
        (a, b) => parseInt(a.node.id) - parseInt(b.node.id),
      );
    },
  },

  /**
   * Methods
   */
  methods: {
    /**
     * Handler for infinite scroll
     */
    async infiniteHandler($state) {
      // If next page doesn't exists, break here
      if (
        this.currentPage + 1 >
        this.$page.type.belongsTo.pageInfo.totalPages
      ) {
        $state.complete();
      } else {
        // Else, fetch next page's data
        const { data } = await this.$fetch(
          `/types/${this.$page.type.slug}/${this.currentPage + 1}`,
        );
        // If we've got edges to add, add them in
        if (data.type.belongsTo.edges.length) {
          this.currentPage = data.type.belongsTo.pageInfo.currentPage;
          this.loadedPokemon.push(...data.type.belongsTo.edges);
          $state.loaded();
        } else {
          // Otherwise, we're done
          $state.complete();
        }
      }
    },
  },

  /**
   * Watchers
   */
  watch: {
    /**
     * Watch for a type change - we'll need to reset the infinite loading
     */
    "$page.type.slug"() {
      this.currentPage = 1;
      this.loadedPokemon = this.$page.type.belongsTo.edges;
      try {
        this.$refs.infiniteLoader.stateChanger.reset();
      } catch (_) {}
    },
  },

  /**
   * Page meta
   */
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
            species {
              colorPalette {
                Vibrant { rgb }
                DarkMuted { rgb }
                DarkVibrant { rgb }
                LightMuted { rgb }
                LightVibrant { rgb }
              }
            }
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
