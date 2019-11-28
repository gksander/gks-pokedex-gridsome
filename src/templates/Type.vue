<template>
  <Layout>
    <div class="display-1">{{ $page.type.name }}</div>
    <ul>
      <li>List out damage relations</li>
      <li>List out pokemon</li>
    </ul>
  </Layout>
</template>

<script>
import PokeTypeChip from "~/components/PokeTypeChip";
export default {
  metaInfo() {
    return {
      title: this.$page.type.name,
    };
  },
};
</script>

<page-query>
query ($id: ID!) {
  type (id: $id) {
    id,
    name,
  }
}
</page-query>
