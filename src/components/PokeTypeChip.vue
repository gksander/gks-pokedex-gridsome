<template>
  <g-link
    :to="`/types/${type.slug}`"
    :class="[
      'border-none bg-gray-100 hover:bg-gray-200 rounded inline-flex justify-center items-center w-20 h-8 transition-colors duration-150',
      customClasses,
      {
        'w-full': block,
      },
    ]"
  >
    {{ type.name }}
  </g-link>
</template>

<script>
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
    customClasses() {
      switch (this.type.name) {
        case "Bug":
          return "text-green-600";
        case "Fire":
          return "text-orange-600";
        case "Grass":
          return "text-green-700";
        case "Poison":
          return "text-purple-700";
        case "Water":
          return "text-blue-700";
        case "Flying":
          return "text-blue-800";
        case "Normal":
          return "text-gray-900";
        case "Electric":
          return "text-yellow-600";
        case "Ground":
          return "text-yellow-700";
        case "Fairy":
          return "text-pink-600";
        case "Fighting":
          return "text-red-700";
        case "Ice":
          return "text-blue-500";
        case "Ghost":
          return "text-purple-500";
        case "Psychic":
          return "text-purple-600";
        case "Rock":
          return "text-gray-700";
        case "Dragon":
          return "text-orange-700";
        case "Steel":
          return "text-gray-600";
        default:
          return "text-gray-900";
      }
    },
  },
};
</script>
