<template>
  <v-hover v-slot:default="{ hover }">
    <g-link
      :to="`/${pokemon.slug}`"
      class="d-block pa-2 text-decoration-none black--text"
      :class="[hover ? 'elevation-4' : 'elevation-0']"
      style="border-radius: 0.3em; max-width: 200px"
    >
      <div style="border-radius: 100%" class="ma-1 elevation-2">
        <g-image
          :src="pokemon.png"
          :alt="`Image for ${pokemon.name}`"
          style="width: 100%"
        ></g-image>
      </div>
      <div class="px-2 pt-1 text-truncate text-center">
        {{ pokemon.name }} <span class="">(#{{ pokemon.id }})</span>
      </div>
    </g-link>
  </v-hover>
</template>

<script>
import PokeTypeBadge from "./PokeTypeBadge";
export default {
  props: {
    pokemon: {
      type: Object,
    },
    elevation: {
      type: Number,
      default: 2,
    },
  },

  components: { PokeTypeBadge },
};
</script>
