<template>
  <div>
    Type details
  </div>
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
