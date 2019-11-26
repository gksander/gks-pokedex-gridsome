<template>
  <g-link :to="`/pokemon/${pokemon.id}`">
    <div class="border rounded hover:shadow-md">
      <div class="p-2 flex flex-row justify-center items-center">
        <g-image
          :src="pokemon.sprite_front"
          :alt="`Sprite for ${pokemon.name}`"
        ></g-image>
      </div>
      <div class="p-2 text-center text-lg">
        {{ pokemon.name }}
      </div>
      <div class="flex flex-row justify-center p-2">
        <poke-type-badge
          v-for="(type, i) in pokemon.types"
          :key="i"
          :type="type"
        ></poke-type-badge>
      </div>
    </div>
  </g-link>
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
