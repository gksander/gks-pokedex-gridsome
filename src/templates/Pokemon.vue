<template>
  <Layout>
    <div class="display-3 mb-2">{{ $page.pokemon.name }}</div>
    <div>
      <poke-type-chip
        v-for="type in $page.pokemon.types"
        :key="type"
        :type="type"
      ></poke-type-chip>
    </div>
    <!-- Cols for display -->
    <v-row>
      <!-- Sprites -->
      <v-col cols="12">
        <v-card>
          <v-row no-gutters>
            <v-col cols="6">
              <g-image
                :src="$page.pokemon.sprite_front"
                style="width: 100%"
                class="fill-height"
              ></g-image>
            </v-col>
            <v-col cols="6">
              <g-image
                :src="$page.pokemon.sprite_back"
                style="width: 100%"
                class="fill-height grey lighten-4"
              ></g-image>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <!-- Details -->
      <v-col cols="12">
        <v-card>
          <v-card-title>Details</v-card-title>
        </v-card>
      </v-col>
      <!-- Stats -->
      <v-col cols="12">
        <v-card>
          <v-card-title>Stats</v-card-title>
        </v-card>
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
      sprite_front(width: 96, height: 96, background: "contain"),
      sprite_back(width: 96, height: 96, background: "contain"),
      types
    }
  }
</page-query>
