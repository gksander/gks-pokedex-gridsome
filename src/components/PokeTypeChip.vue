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
      <v-icon right x-small v-if="starred">fa-star</v-icon>
    </v-btn>
  </v-hover>
</template>

<script>
// Component
import typeToColor from "../util/type-to-color";

export default {
  props: {
    type: {
      type: Object,
      required: true,
    },
    block: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    starred: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    color() {
      return typeToColor(this.type.name);
    },
    solid() {
      return /steel/i.test(this.type.name);
    },
    className() {
      return /fairy/i.test(this.type.name) ? ["pink--text", "lighten-2"] : [];
    },
  },
};
</script>
