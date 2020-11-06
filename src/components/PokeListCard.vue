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
              :style="{
                backgroundImage: `url('/img/pokemon/${pokemon.id}.svg')`,
                backgroundSize: 'contain',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
              }"
              :to="`/${pokemon.slug}`"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="sm:col-span-3 sm:pt-3">
      <div class="flex justify-between items-baseline">
        <g-link
          :to="`/${pokemon.slug}`"
          class="font-bold text-2xl text-gray-800 hover:text-primary-800 transition-colors duration-150"
        >
          {{ pokemon.name }}</g-link
        >
        <span class="text-gray-600 text-xl font-bold">#{{ pokemon.id }}</span>
      </div>
      <div v-html="pokemon.species.flavor_text" class="text-gray-700 mb-2" />
      <div class="flex gap-x-2">
        <poke-type-chip
          v-for="type in pokemon.types"
          :key="type.slug"
          :type="type"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { get } from "lodash";
import PokeTypeChip from "./PokeTypeChip";
import PokeBall from "./PokeBall";

export default {
  components: {
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
      // const { _r, _g, _b } = tinycolor(bgColor)["lighten"](20);
    },
  },
};
</script>

<style scoped>
/**
.card {
  filter: grayscale(0.75);
}
.card:hover {
  filter: grayscale(0);
}

 */
.pokeImg:hover .image {
  cursor: pointer;
  filter: drop-shadow(1px 1px 2px rgba(50, 50, 50, 0.6));
}
.pokeball {
  filter: brightness(0) opacity(0.3);
}
.pokeImg:hover .pokeball {
  filter: brightness(1) opacity(1);
  transform: scale(1.2) rotate(180deg);
}
</style>
