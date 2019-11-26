<template>
  <div
    class="p-1 rounded-lg text-sm text-center mr-2"
    :class="[...className, ...(isLarge ? ['w-20', 'text-lg'] : ['w-16'])]"
  >
    {{ type }}
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
    },
    isLarge: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    className() {
      switch (this.type) {
        case "Dark":
          return ["bg-black", "text-white"];
        case "Dragon":
          return ["border", "border-orange-400", "text-orange-600"];

        case "Fairy":
          return ["border", "border-pink-500", "text-pink-500"];
        case "Fighting":
          return ["border", "border-red-700", "text-red-700"];

        case "Ghost":
          return ["bg-purple-100", "border", "border-purple-200"];

        case "Ground":
          return [
            "bg-yellow-100",
            "border",
            "border-yellow-800",
            "text-yellow-800",
          ];
        case "Ice":
          return ["border", "border-blue-500", "text-blue-700"];
        case "Psychic":
          return [
            "bg-purple-100",
            "border",
            "border-purple-700",
            "text-purple-700",
          ];
        case "Rock":
          return ["bg-gray-100", "border", "border-gray-300", "text-gray-800"];
        case "Shadow":
          return [];
        case "Steel":
          return ["bg-gray-100", "border", "border-gray-200"];
        case "Unknown":
          return [];
      }
    },
  },
};
</script>

<static-query>
  query {
    allType {
      edges {
        node {
          name
        }
      }
    }
  }
</static-query>
