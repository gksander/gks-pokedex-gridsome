<template>
  <g-link
    :to="`/types/${type.slug}`"
    :class="[
      'border-2 rounded inline-flex justify-center items-center transition-all duration-150',
      small && 'text-xs',
      small ? 'w-20' : 'w-24',
      small ? 'h-6' : 'h-8',
      block && 'w-full',
      grayscale && 'grayscale',
      customClasses,
    ]"
  >
    {{ type.name }}
    <font-awesome-icon v-if="starred" icon="star" class="ml-1" />
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
    grayscale: {
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
          return "text-green-700 border-green-600 hover:bg-green-100";
        case "Fire":
          return "text-orange-700 border-orange-600 hover:bg-orange-100";
        case "Grass":
          return "text-green-700 border-green-700 hover:bg-green-100";
        case "Poison":
          return "text-purple-700 border-purple-700 hover:bg-purple-100";
        case "Water":
          return "text-blue-700 border-blue-700 hover:bg-blue-100";
        case "Flying":
          return "text-blue-800 border-blue-800 hover:bg-blue-100";
        case "Normal":
          return "text-gray-900 border-gray-900 hover:bg-gray-100";
        case "Electric":
          return "text-yellow-800 border-yellow-600 hover:bg-yellow-100";
        case "Ground":
          return "text-yellow-800 border-yellow-700 hover:bg-yellow-100";
        case "Fairy":
          return "text-pink-700 border-pink-600 hover:bg-pink-100";
        case "Fighting":
          return "text-red-700 border-red-700 hover:bg-red-100";
        case "Ice":
          return "text-blue-700 border-blue-500 hover:bg-blue-100";
        case "Ghost":
          return "text-purple-700 border-purple-500 hover:bg-purple-100";
        case "Psychic":
          return "text-purple-600 border-purple-600 hover:bg-purple-100";
        case "Rock":
          return "text-gray-700 border-gray-700 hover:bg-gray-100";
        case "Dragon":
          return "text-orange-700 border-orange-700 hover:bg-orange-100";
        case "Steel":
          return "text-gray-700 border-gray-600 hover:bg-gray-100";
        default:
          return "text-gray-900 border-gray-900 hover:bg-gray-100";
      }
    },
  },
};
</script>

<style scoped>
.grayscale {
  filter: grayscale(1) brightness(0.5);
}
.grayscale:hover {
  filter: grayscale(0) brightness(1);
}
</style>
