<template>
  <div class="grid sm:grid-cols-4 gap-6 card transition-all duration-300">
    <div class="sm:col-span-1 flex justify-center">
      <div class="w-56 sm:w-full pokeImg">
        <div class="relative" style="padding-top: 100%">
          <div class="absolute inset-0">
            <div
              :style="{
                color: pokeballColor,
              }"
              class="p-2"
            >
              <poke-ball class="pokeball transition-all duration-300" />
            </div>
            <g-link
              class="absolute inset-0 image transition-all duration-300"
              :to="`/${pokemon.slug}`"
              :aria-label="`View ${pokemon.name}`"
            >
              <PokeImg
                :id="pokemon.id"
                :name="pokemon.name"
                img-class="w-full h-full object-contain"
              />
            </g-link>
          </div>
        </div>
      </div>
    </div>
    <div class="sm:col-span-3 sm:pt-3">
      <div class="flex justify-between items-baseline">
        <g-link
          :to="`/${pokemon.slug}`"
          class="font-bold text-2xl text-gray-800 hover:text-primary-800 transition-colors duration-150"
          :aria-label="`View ${pokemon.name}`"
        >
          {{ pokemon.name }}</g-link
        >
        <span class="text-gray-600 text-xl font-bold">#{{ pokemon.id }}</span>
      </div>
      <div v-html="pokemon.species.flavor_text" class="text-gray-700 mb-2" />
      <div class="-mx-1">
        <poke-type-chip
          v-for="type in pokemon.types"
          :key="type.slug"
          :type="type"
          class="mx-1"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { get } from "lodash";
import PokeTypeChip from "./PokeTypeChip";
import PokeBall from "./PokeBall";
import PokeImg from "./PokeImg";

export default {
  components: {
    PokeImg,
    PokeTypeChip,
    PokeBall,
  },

  props: {
    // Pokemon needs id, slug, name, and png.
    // This is data that needs to come from a page/template, and then passed along here.
    pokemon: {
      type: Object,
    },
  },

  computed: {
    pokeballColor() {
      const rgb =
        get(this.pokemon, `species.colorPalette.LightMuted.rgb`) ||
        get(this.pokemon, `species.colorPalette.LightVibrant.rgb`);
      return rgb
        ? `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.5)`
        : "rgba(0,0,0,0.5)";
    },
  },
};
</script>

<style scoped>
.pokeImg:hover .image {
  cursor: pointer;
}
.pokeball {
  filter: brightness(0) opacity(0.3);
}
.pokeImg:hover .pokeball {
  filter: brightness(1) opacity(1);
  transform: scale(1.2) rotate(180deg);
}
</style>
