<template>
  <Layout>
    <!-- Container -->
    <content-wrapper>
      <!-- Cols for display -->
      <v-row>
        <v-col cols="8" offset="2" sm="5" offset-sm="0">
          <g-image
            :src="$page.pokemon.png"
            style="width: 100%"
            class="fill-height"
          ></g-image>
        </v-col>
        <v-col cols="12" sm="7">
          <div class="display-1 mb-2">{{ $page.pokemon.name }}</div>
          <div class="mb-4">
            <poke-type-chip
              v-for="type in $page.pokemon.types"
              :key="type.id"
              :type="type"
            ></poke-type-chip>
          </div>
          <!-- Weight/height -->
          <div class="d-flex mb-2">
            <div class="mr-5 d-flex align-center">
              <v-icon class="mr-2" color="grey darken-2"
                >fa-ruler-vertical</v-icon
              >
              <span class="title font-weight-thin"
                >{{ $page.pokemon.height }} ft</span
              >
            </div>
            <div class="d-flex align-center">
              <v-icon class="mr-2" color="grey darken-2">fa-weight</v-icon>
              <span class="title font-weight-thin"
                >{{ $page.pokemon.weight }} lbs</span
              >
            </div>
          </div>
          <!-- Description -->
          <div v-html="$page.pokemon.species.flavor_text"></div>
        </v-col>
      </v-row>
      <!-- Stats -->
      <v-row>
        <v-col
          v-for="stat in $page.pokemon.stats"
          :key="stat.name"
          cols="4"
          sm="2"
          class="text-center"
        >
          <v-progress-circular
            :value="stat.base"
            class="mb-1 darken-2"
            :color="color"
            size="52"
            width="6"
          >
            {{ stat.base }}
          </v-progress-circular>
          <div :style="{ color }">
            {{ stat.name }}
          </div>
        </v-col>
      </v-row>
    </content-wrapper>

    <!-- Bottom navigation -->
    <v-bottom-navigation app grow>
      <v-btn :to="prevLink" width="100" :disabled="!prevLink">
        <span>{{ _get($page, "pokemon.prev_pokemon.name", "") }}</span>
        <v-icon>fa-chevron-left</v-icon>
      </v-btn>
      <v-btn to="/" exact>
        <span>All</span>
        <v-icon>fa-list-alt</v-icon>
      </v-btn>
      <v-btn :to="nextLink" :disabled="!nextLink" width="100">
        <span>{{ _get($page, "pokemon.next_pokemon.name", "") }}</span>
        <v-icon>fa-chevron-right</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </Layout>
</template>

<script>
import PokeTypeChip from "~/components/PokeTypeChip";
import { get } from "lodash";

export default {
  components: { PokeTypeChip },

  computed: {
    prevLink() {
      return "/" + get(this.$page, "pokemon.prev_pokemon.slug", "");
    },
    nextLink() {
      return "/" + get(this.$page, "pokemon.next_pokemon.slug", "");
    },
    color() {
      const color = get(this.$page, "pokemon.species.color");
      return color.replace(/white/i, "grey").replace(/yellow/i, "#c9bc4e");
    },
  },

  methods: {
    _get: get,
  },

  metaInfo() {
    return {
      title: this.$page.pokemon.name,
    };
  },
};
</script>

<page-query>
  query ($id: ID!) {
    pokemon(id: $id) {
      id,
      name,
      png(width: 150, height: 150, fit: contain, background: "transparent")
      types { id, name, slug }
      weight
      height
      stats { base, name }
      species { flavor_text, color }
      prev_pokemon { name, slug }
      next_pokemon { name, slug }
    }
  }
</page-query>
