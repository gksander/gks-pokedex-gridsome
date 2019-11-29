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
    </content-wrapper>
  </Layout>
</template>

<script>
import PokeTypeChip from "../components/PokeTypeChip";
export default {
  metaInfo() {
    return {
      title: this.$page.type.name,
    };
  },

  components: { PokeTypeChip },

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
    console.log(this.superEffectiveAgainst);
  },
};
</script>

<page-query>
query ($id: ID!) {
  type (id: $id) {
    id,
    name,
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
