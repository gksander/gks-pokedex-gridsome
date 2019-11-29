<template>
  <v-hover v-slot:default="{ hover }">
    <v-chip
      :to="`/types/${type.slug}`"
      :outlined="!solid"
      :color="color"
      :class="[
        'mr-2',
        hover ? 'elevation-3' : 'elevation-0',
        ...(className || []),
      ]"
    >
      {{ type.name }}
    </v-chip>
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
