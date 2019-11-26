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
