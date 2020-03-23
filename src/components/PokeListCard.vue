<template>
  <v-hover v-slot:default="{ hover }">
    <g-link :to="`/${pokemon.slug}`" style="text-decoration: none;">
      <v-card
        class="pa-2"
        :style="{
          borderBottom: `2px solid ${color}`,
          background: `linear-gradient(to bottom, ${bgColor}, ${darkerBgColor})`
        }"
        :elevation="hover ? 5 : 2"
      >
        <v-img
          :src="`/img/pokemon/${pokemon.id}.svg`"
          :alt="`Image for ${pokemon.name}`"
          :aspect-ratio="1"
          contain
          width="150"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5" />
            </v-row>
          </template>
        </v-img>
        <div class="px-2 pt-1 text-truncate text-center">
          {{ pokemon.name }} <span class="">(#{{ pokemon.id }})</span>
        </div>
      </v-card>
    </g-link>
  </v-hover>
</template>

<script>
import { get } from "lodash";
import tinycolor from "tinycolor2";

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

    bgColor() {
    	const prefix = this.$vuetify.theme.dark ? 'Dark' : 'Light';

	    const rgb =
		    get(this.pokemon, `species.colorPalette.${prefix}Muted.rgb`) ||
		    get(this.pokemon, `species.colorPalette.${prefix}Vibrant.rgb`);
	    return rgb
		    ? `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
		    : this.$vuetify.theme.themes.secondary;
    },

    darkerBgColor() {
    	const bgColor = this.bgColor;
	    const { _r, _g, _b } = tinycolor(bgColor)[this.$vuetify.theme.dark ? "darken" : "lighten"](this.$vuetify.theme.dark ? 20 : 30);
	    return `rgb(${_r}, ${_g}, ${_b})`
    }
  },
};
</script>
