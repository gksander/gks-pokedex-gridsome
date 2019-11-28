<template>
  <v-card :to="`/pokemon/${pokemon.slug}`">
    <g-image
      :src="pokemon.sprite_front"
      :alt="`Sprite for ${pokemon.name}`"
      style="width: 100%"
    ></g-image>
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
