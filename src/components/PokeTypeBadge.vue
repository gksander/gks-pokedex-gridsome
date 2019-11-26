<template>
  <div
    class="p-1 rounded-full text-sm w-16 text-center ml-1"
    :class="{
      // Normal...
      ['border']: isNormal,
      ['border-black']: isNormal,
      // Grass
      ['bg-green-700']: isGrass,
      // Fire
      ['bg-orange-500']: isFire,
      // Water
      ['bg-blue-700']: isWater,
      // Electric
      ['bg-yellow-400']: isElectric,

      ['bg-green-500']: /^bug$/i.test(type),

      ['bg-pink-300']: /^poison$/i.test(type),

      ['bg-blue-100']: /^ice$/i.test(type),
      // White text on specific types
      ['text-white']: /^(grass|bug|water|fire)$/i.test(type),
    }"
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
    isNormal() {
      return /^normal$/i.test(this.type);
    },
    isFire() {
      return /^fire$/i.test(this.type);
    },
    isGrass() {
      return /^grass$/i.test(this.type);
    },
    isWater() {
      return /^water$/i.test(this.type);
    },
    isElectric() {
      return /^electric$/i.test(this.type);
    },
  },
};
</script>
