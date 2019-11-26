<template>
  <Layout>
    <div class="flex flex-row flex-wrap -mx-2">
      <!-- Left col -->
      <div class="w-full sm:w-1/2 p-2">
        <g-image
          :src="$page.pokemon.sprite_front"
          class="w-full bg-gray-200 rounded-lg"
        ></g-image>
        <div class="text-5xl leading-tight leading-snug mt-2 font-thin">
          {{ $page.pokemon.name }}
        </div>
        <div class="flex flex-row mt-1">
          <poke-type-badge
            v-for="(type, i) in $page.pokemon.types"
            :key="i"
            :type="type"
            :is-large="true"
          ></poke-type-badge>
        </div>
      </div>
      <div class="w-full sm:w-1/2 p-2">
        <div class="p-4 rounded bg-blue-300 mb-3">
          Details
        </div>
        <div class="p-4 rounded bg-gray-600">
          Stats
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import PokeTypeBadge from "~/components/PokeTypeBadge";
export default {
  components: { PokeTypeBadge },
};
</script>

<page-query>
  query ($id: ID!) {
    pokemon(id: $id) {
      id,
      name,
      sprite_front(width: 96, height: 96, background: "contain"),
      types
    }
  }
</page-query>
