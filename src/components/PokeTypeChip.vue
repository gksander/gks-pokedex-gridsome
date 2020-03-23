<template>
  <v-hover v-slot:default="{ hover }">
    <v-btn
      :to="`/types/${type.slug}`"
      :color="details.color"
      :class="[
        hover ? 'elevation-3' : 'elevation-0',
        ...(details.className || []),
      ]"
      :small="small"
      :block="block"
      :outlined="details.outlined || false"
    >
      {{ type.name }}
      <v-icon right x-small v-if="starred">$star</v-icon>
    </v-btn>
  </v-hover>
</template>

<script>
// Component
import typeToColor from "../util/type-to-color";

export default {
  props: {
    // The type object (id, slug, name required)
    type: {
      type: Object,
      required: true,
    },
    // Whether to display the button as a block
    block: {
      type: Boolean,
      default: false,
    },
    // Small button?
    small: {
      type: Boolean,
      default: false,
    },
    // Add a star? Used for super-duper effective types
    starred: {
      type: Boolean,
      default: false,
    },
  },

  /**
   * Computed props
   */
  computed: {
    // Details
    details() {
      const isDark = this.$vuetify.theme.dark;

      switch (this.type.name) {
        case "Bug":
          return { color: "green lighten-2" };
        case "Fire":
          return { color: "orange darken-1", className: ["white--text"] };
        case "Grass":
          return { color: "green darken-3", className: ["white--text"] };
        case "Poison":
          return { color: "pink lighten-1", className: ["white--text"] };
        case "Water":
          return { color: "blue darken-2", className: ["white--text"] };
        case "Flying":
          return { color: "blue darken-4", className: ["white--text"] };
        case "Normal":
          return { color: isDark ? "white" : "black", outlined: true };
        case "Electric":
          return { color: "yellow darken-3" };
        case "Ground":
          return { color: "brown lighten-1", className: ["white--text"] };
        case "Fairy":
          return { color: "pink lighten-2" };
        case "Fighting":
          return { color: "red darken-2", className: ["white--text"] };
        case "Ice":
          return { color: "blue lighten-2" };
        case "Ghost":
          return { color: "purple lighten-2" };
        case "Psychic":
          return { color: "purple darken-2", className: ["white--text"] };
        case "Rock":
          return { color: "grey darken-2", className: ["white--text"] };
        case "Dragon":
          return { color: "orange darken-1", className: ["white--text"] };
        case "Steel":
          return { color: "grey lighten-3" };
        default:
          return { color: "black", className: ["white--text"] };
      }
    },

    // Show it as solid?
    solid() {
      return /(rock|ground)/i.test(this.type.name);
    },
    light() {
      return /(normal|steel)/i.test(this.type.name);
    },
    // Additional classes for certain types
    className() {
      return /fairy/i.test(this.type.name) ? ["pink--text", "lighten-2"] : [];
    },
  },
};
</script>
