<template>
  <v-app>
    <!-- Navigation drawer -->
    <v-navigation-drawer
      app
      v-model="sideNavVisible"
      clipped
      :mobile-break-point="850"
      :width="270"
    >
      <v-list shaped>
        <v-list-item v-for="tab in tabs" :key="tab.title" :to="tab.to">
          <v-list-item-content>
            <v-list-item-title>{{ tab.title }}</v-list-item-title>
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
        <v-icon>fa-home</v-icon>
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
      tabs: [
        { title: "Pokemon", to: "/pokemon" },
        // { title: "Generations", to: "/generations" },
        { title: "Types", to: "/types" },
      ],
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
}
</static-query>
