<template>
  <v-card :to="`/${pokemon.slug}`">
    <div class="pa-4 pb-0">
      <g-image
        :src="pokemon.png"
        :alt="`Image for ${pokemon.name}`"
        style="width: 100%"
      ></g-image>
    </div>
    <div class="pa-2">
      {{ pokemon.name }} <span class="">(#{{ pokemon.id }})</span>
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
