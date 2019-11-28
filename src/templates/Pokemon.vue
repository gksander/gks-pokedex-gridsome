<template>
  <Layout>
    <!-- Cols for display -->
    <v-row>
      <v-col cols="12" sm="5">
        <g-image
          :src="$page.pokemon.svg"
          style="width: 100%"
          class="fill-height"
        ></g-image>
      </v-col>
      <v-col cols="12" sm="7">
        <div class="display-1 mb-2">{{ $page.pokemon.name }}</div>
        <div>
          <poke-type-chip
            v-for="type in $page.pokemon.types"
            :key="type.id"
            :type="type"
          ></poke-type-chip>
        </div>
      </v-col>
    </v-row>
    <!-- Stats -->
    <v-row>
      <v-col
        v-for="stat in $page.pokemon.stats"
        :key="stat.name"
        cols="4"
        sm="2"
        class="text-center"
      >
        <v-progress-circular
          :value="stat.base"
          class="mb-1"
          color="primary"
          size="52"
          width="6"
        >
          {{ stat.base }}
        </v-progress-circular>
        <div>{{ stat.name }}</div>
      </v-col>
    </v-row>
  </Layout>
</template>

<script>
import PokeTypeChip from "~/components/PokeTypeChip";
export default {
  components: { PokeTypeChip },

  metaInfo() {
    return {
      title: this.$page.pokemon.name,
    };
  },
};
</script>

<page-query>
  query ($id: ID!) {
    pokemon(id: $id) {
      id,
      name,
      svg(width: 150, height: 150, fit: contain)
      types { id, name, slug }
      stats {
        base
        name
      }
    }
  }
</page-query>
