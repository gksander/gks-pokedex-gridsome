<template>
  <div>
    <v-card>
      <v-card-text>
        EVOLUTION CHAIN!
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    links: {
      type: Array,
      required: true,
    },
  },

  mounted() {
    console.log(this.links);
  },
};
</script>
