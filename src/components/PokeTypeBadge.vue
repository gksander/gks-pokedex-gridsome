<template>
  <div
    class="p-1 rounded-full text-sm w-16 text-center ml-1"
    :class="className"
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
  },

  computed: {
    // Testing types. E.g., is["normal"] === true
    isType() {
      return this.$static.allType.edges
        .map(edge => edge.node.name)
        .reduce((obj, type) => {
          obj[type] = new RegExp(`^${type}$`, "i").test(this.type);
          return obj;
        }, {});
    },

    className() {
      switch (this.type) {
        case "Bug":
          return ["border", "border-green-600", "text-green-600"];
        case "Dark":
          return ["bg-black", "text-white"];
        case "Dragon":
          return ["border", "border-orange-400", "text-orange-600"];
        case "Electric":
          return [
            "bg-yellow-100",
            "border",
            "border-yellow-600",
            "text-yellow-600",
          ];
        case "Fairy":
          return ["border", "border-pink-500", "text-pink-500"];
        case "Fighting":
          return ["border", "border-red-700", "text-red-700"];
        case "Fire":
          return [
            "bg-orange-100",
            "border",
            "border-orange-500",
            "text-orange-500",
          ];
        case "Flying":
          return ["border", "border-blue-800", "text-blue-800"];
        case "Ghost":
          return ["bg-purple-100", "border", "border-purple-200"];
        case "Grass":
          return [
            "bg-green-100",
            "border",
            "border-green-800",
            "text-green-800",
          ];
        case "Ground":
          return [
            "bg-yellow-100",
            "border",
            "border-yellow-800",
            "text-yellow-800",
          ];
        case "Ice":
          return ["border", "border-blue-500", "text-blue-700"];
        case "Normal":
          return ["border", "border-black"];
        case "Poison":
          return ["bg-pink-100", "border", "border-pink-700", "text-pink-700"];
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
        case "Water":
          return ["bg-blue-100", "border", "border-blue-700", "text-blue-700"];
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
