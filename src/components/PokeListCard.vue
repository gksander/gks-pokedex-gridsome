<template>
  <v-hover v-slot:default="{ hover }">
    <g-link :to="`/${pokemon.slug}`" style="text-decoration: none;">
      <v-card
        class="pa-2"
        :style="{
          borderBottom: `2px solid ${color}`,
        }"
        :elevation="hover ? 5 : 2"
      >
        <g-image
          :src="pokemon.png"
          :alt="`Image for ${pokemon.name}`"
          style="width: 100%"
        />
        <div class="px-2 pt-1 text-truncate text-center">
          {{ pokemon.name }} <span class="">(#{{ pokemon.id }})</span>
        </div>
      </v-card>
    </g-link>
  </v-hover>
</template>

<script>
import { get } from "lodash";
export default {
  props: {
    // Pokemon needs id, slug, name, and png.
    // This is data that needs to come from a page/template, and then passed along here.
    pokemon: {
      type: Object,
    },
  },

  computed: {
    color() {
      const rgb = get(this.pokemon, "species.colorPalette.Vibrant.rgb", [
        0,
        0,
        0,
      ]);
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    },
  },
};
</script>
