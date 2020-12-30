<template>
  <picture>
    <source :srcset="`/img/pokemon-sugimori/${id}.webp`" type="image/webp" />
    <source :srcset="`/img/pokemon-sugimori/${id}.png`" type="image/png" />
    <img
      :src="`/img/pokemon-sugimori/${id}.png`"
      class="w-full h-full object-contain"
      :style="imgStyle"
      :alt="`Sugimori artwork of ${name}`"
    />
  </picture>
</template>

<script>
export default {
  props: {
    id: String,
    name: String,
    imgClass: {
      type: String,
      default: "",
    },
    imgStyle: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
