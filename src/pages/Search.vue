<template>
  <div class="container max-w-2xl px-2 py-6">
    <div class="text-5xl font-fancy mb-6">Search for a Pokemon</div>
    <div class="border-2 border-gray-800 rounded">
      <input
        type="text"
        v-model="query"
        class="p-3 w-full text-xl outline-none"
        placeholder="Mew"
      />
      <g-link
        v-for="pokemon in filteredPokemon"
        :key="pokemon.id"
        :to="`/${pokemon.slug}`"
        class="block p-3 flex items-center hover:bg-primary-100 transition-colors duration-150"
      >
        <div class="flex-grow flex items-center">
          <div class="w-8 mr-3">
            <div class="w-full relative" style="padding-top: 100%">
              <div
                class="absolute inset-0"
                :style="{
                  backgroundImage: `url('/img/pokemon/${pokemon.id}.svg')`,
                  backgroundPosition: 'center',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                }"
              ></div>
            </div>
          </div>
          <div class="font-bold text-gray-700">
            #{{ pokemon.id }} - {{ pokemon.name }}
          </div>
        </div>
        <font-awesome-icon icon="chevron-right" />
      </g-link>
    </div>
  </div>
</template>

<script>
import PokeTypeChip from "../components/PokeTypeChip";

export default {
  components: { PokeTypeChip },

  /**
   * Component data
   */
  data() {
    return {
      query: "",
    };
  },

  computed: {
    allPokemon() {
      return this.$page.allPokemon.edges.map(edge => edge.node);
    },

    filteredPokemon() {
      const reg = new RegExp(this.query, "i");
      return this.allPokemon
        .filter(pokemon => reg.test(pokemon.name))
        .slice(0, 10);
    },
  },

  /**
   * Page meta
   */
  metaInfo() {
    return {
      title: "Search Pokemon",
      meta: [{ name: "description", content: "Pokemon listing" }],
      name: "search",
    };
  },
};
</script>

<page-query>
query {
  allPokemon(sortBy: "id", order: ASC) {
    edges {
      node {
        id, name, slug,
        types { id, name, slug }
      }
    }
  }
}
</page-query>
