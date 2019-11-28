<template>
  <Layout>
    <content-wrapper>
      <v-btn to="/pokemon" block color="primary" outlined
        >CLICK ME TO SEE POKEMON</v-btn
      >
    </content-wrapper>
  </Layout>
</template>

<script>
import PokeListCard from "~/components/PokeListCard";
export default {
  components: { PokeListCard },
  metaInfo: {
    title: "Pokemon",
  },
};
</script>
