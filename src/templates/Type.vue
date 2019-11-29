<template>
  <Layout>
    <content-wrapper>
      <div class="display-1 mb-2">{{ $page.type.name }}</div>
      <!-- Damage relations -->
      <div class="mb-3" v-for="cat in damageCategories" :key="cat.title">
        <div class="title mb-1">{{ cat.title }}</div>
        <template v-if="cat.types.length > 0">
          <poke-type-chip
            v-for="type in cat.types"
            :key="type.name"
            :type="type"
          ></poke-type-chip>
        </template>
        <template v-else>
          <div class="font-italic">Nothing...</div>
        </template>
      </div>

      <!-- Pokemon of this type... -->
      <div class="title">Pokemon</div>
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
          title: "Super Effective Against:",
          types: this.superEffectiveAgainst,
        },
        {
          title: "Not Very Effective Against:",
          types: this.notVeryEffectiveAgainst,
        },
        { title: "Not Effective Against:", types: this.notEffectiveAgainst },
      ];
    },
  },

  mounted() {
    console.log(this.$page.type.belongsTo.edges);
  },
};
</script>

<page-query>
query ($id: ID!) {
  type (id: $id) {
    id,
    name,
    belongsTo(
      filter: { typeName: { eq: Pokemon } },
      sortBy: "id", order: ASC
    ) {
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
