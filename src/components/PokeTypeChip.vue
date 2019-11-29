<template>
  <v-hover v-slot:default="{ hover }">
    <v-chip
      :to="`/types/${type.slug}`"
      :outlined="!details.solid"
      :color="details.color"
      :class="[hover ? 'elevation-3' : 'elevation-0', ...(details.class || [])]"
    >
      {{ type.name }}
    </v-chip>
  </v-hover>
</template>

<script>
// Component
export default {
  props: {
    type: {
      type: Object,
      required: true,
    },
  },

  computed: {
    details() {
      switch (this.type.name) {
        case "Bug":
          return { color: "green lighten-2" };
        case "Fire":
          return { color: "orange darken-1" };
        case "Grass":
          return { color: "green darken-3" };
        case "Poison":
          return { color: "pink lighten-1" };
        case "Water":
          return { color: "blue darken-2" };
        case "Flying":
          return { color: "blue darken-4" };
        case "Normal":
          return { color: "black" };
        case "Electric":
          return { color: "yellow darken-3" };
        case "Ground":
          return { color: "brown lighten-1" };
        case "Fairy":
          return { color: "pink lighten-2", class: "pink--text lighten-2" };
        case "Fighting":
          return { color: "red darken-2" };
        case "Ice":
          return { color: "blue lighten-2" };
        case "Ghost":
          return { color: "purple lighten-2" };
        case "Psychic":
          return { color: "purple darken-2" };
        case "Rock":
          return { color: "grey darken-2" };
        case "Dragon":
          return { color: "orange darken-1" };
        case "Steel":
          return { color: "grey lighten-3", solid: true };
        default:
          return { color: "black" };
      }
    },
  },
};
</script>
