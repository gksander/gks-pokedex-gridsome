<template>
  <v-hover v-slot:default="{ hover }">
    <v-btn
      :to="`/types/${type.slug}`"
      :outlined="!solid"
      :color="color"
      :class="[hover ? 'elevation-3' : 'elevation-0', ...(className || [])]"
      :small="small"
      :block="block"
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
    // Color of the button
    color() {
      return typeToColor(this.type.name);
    },
    // Show it as solid?
    solid() {
      return /steel/i.test(this.type.name);
    },
    // Additional classes for certain types
    className() {
      return /fairy/i.test(this.type.name) ? ["pink--text", "lighten-2"] : [];
    },
  },
};
</script>
