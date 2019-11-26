<template>
  <g-link :to="`/pokemon/${pokemon.id}`">
    <div class="border rounded hover:shadow-md">
      <g-image
        :src="pokemon.sprite_front"
        :alt="`Sprite for ${pokemon.name}`"
        class="w-full bg-gray-100 border-b"
      ></g-image>
      <div class="p-3">
        <div class="text-2xl mb-1">
          {{ pokemon.name }}
        </div>
        <div class="flex flex-row">
          <poke-type-badge
            v-for="(type, i) in pokemon.types"
            :key="i"
            :type="type"
          ></poke-type-badge>
        </div>
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
