<template>
  <v-img
    :src="`/img/pokemon-sugimori/${id}.png`"
    :alt="`Image for ${name}`"
    :aspect-ratio="1"
    contain
    :width="width"
  >
    <template v-slot:placeholder>
      <v-row class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular indeterminate color="grey lighten-5" />
      </v-row>
    </template>
  </v-img>
</template>

<script>
export default {
  props: {
    id: String,
    name: String,
    width: {
      type: Number,
      default: 30,
    },
  },
};
</script>
