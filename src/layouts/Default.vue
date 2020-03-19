<template>
  <v-app>
    <!-- App bar -->
    <v-app-bar
      app
      clipped-left
      color="primary"
      dark
      prominent
      shrink-on-scroll
      scroll-threshold="400"
    >
      <v-toolbar-title>PokeDex</v-toolbar-title>
      <v-spacer/>
      <v-btn icon to="/" title="Home">
        <v-icon>$home</v-icon>
      </v-btn>
      <template v-slot:extension>
        <v-tabs>
          <v-tab to="/">Pokemon</v-tab>
          <v-tab to="/search">Search</v-tab>
          <v-tab to="/types">Types</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <!-- Content body -->
    <v-content class="fill-height">
      <v-container>
        <slot />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  // Component data
  data() {
    return {
      sideNavVisible: null,
      tabs: [
        { title: "Pokemon", to: "/" },
        { title: "Search", to: "/search" },
        { title: "Types", to: "/types" },
      ],
    };
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
