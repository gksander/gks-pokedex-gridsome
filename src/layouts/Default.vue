<template>
  <v-app>
    <!-- Navigation drawer -->
    <v-navigation-drawer
      app
      v-model="sideNavVisible"
      clipped
      :mobile-break-point="950"
      :width="270"
    >
      <div class="px-3 pt-2">
        <v-text-field
          label="Search"
          hide-details
          v-model="query"
        ></v-text-field>
      </div>
      <!-- List out pokemon -->
      <v-list two-line shaped>
        <v-list-item
          v-for="edge in filteredPokemon"
          :key="edge.node.id"
          :to="`/pokemon/${edge.node.slug}`"
        >
          <v-list-item-avatar>
            <g-image :src="edge.node.sprite_front"></g-image>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ edge.node.name }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ edge.node.types.join(" - ") }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- App bar -->
    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon
        @click="sideNavVisible = !sideNavVisible"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>PokeDex</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon to="/">
        <v-icon>home</v-icon>
      </v-btn>
    </v-app-bar>
    <!-- Content body -->
    <v-content>
      <v-container>
        <slot />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import SiteHeader from "~/components/SiteHeader";
export default {
  components: { SiteHeader },
  // Component data
  data() {
    return {
      sideNavVisible: null,
      query: "",
    };
  },
  // Computed
  computed: {
    filteredPokemon() {
      const re = new RegExp(this.query, "i");
      return this.$static.allPokemon.edges.filter(edge =>
        re.test(edge.node.name),
      );
    },
  },
};
</script>

<static-query>
query {
  metadata {
    siteName
  }
  allPokemon (sortBy: "id", order: ASC) {
    edges {
      node {
        id,
        name,
        slug,
        sprite_front(width: 40, height: 40, background: "contain"),
        types
      }
    }
  }
}
</static-query>

<style>
.container {
  max-width: 560px;
}
</style>
