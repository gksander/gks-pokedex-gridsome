<template>
  <v-card :to="`/pokemon/${pokemon.slug}`">
    <div class="pa-4 pb-0">
      <g-image
        :src="pokemon.png"
        :alt="`Sprite for ${pokemon.name}`"
        style="width: 100%"
      ></g-image>
    </div>
    <div class="pa-2">
      {{ pokemon.name }}
    </div>
  </v-card>
</template>

<script>
import PokeTypeBadge from "./PokeTypeBadge";
export default {
  props: {
    pokemon: {
      type: Object,
    },
  },

  components: { PokeTypeBadge },
};
</script>
