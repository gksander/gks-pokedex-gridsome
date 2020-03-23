<template>
  <v-app>
    <!-- App bar -->
    <v-app-bar app>
      <v-toolbar-items>
        <v-btn text to="/">
          <g-image
            src="~/assets/img/pokeball.png"
            width="40"
            fit="contain"
            style="margin-right: 10px"
            alt="Pokeball image"
          />
          PokeDex
        </v-btn>
      </v-toolbar-items>
      <v-spacer />
      <v-toolbar-items>
        <v-checkbox
          v-model="$vuetify.theme.dark"
          hide-details
          class="align-center"
          on-icon="$moon"
          off-icon="$sun"
        />
        <!-- Mobile menu -->
        <v-menu offset-y v-if="showMenu">
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on">
              Menu
              <v-icon right>$menu</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="link in links"
              :key="link.title"
              :to="link.to"
            >
              <v-list-item-title>{{ link.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <!-- Desktop -->
        <template v-else>
          <v-btn
            v-for="link in links"
            :key="link.title"
            text
            :to="link.to"
            >{{ link.title }}</v-btn
          >
        </template>
      </v-toolbar-items>
    </v-app-bar>
    <!-- Content body -->
    <router-view />
  </v-app>
</template>

<script>
const STORAGE_KEY = "IS_DARK_MODE";

export default {
  // Component data
  data() {
    return {
      links: [
        { title: "Search", to: "/search" },
        { title: "Types", to: "/types" },
        // { title: "Moves", to: "/moves" },
      ],
      isMounted: false,
    };
  },

  computed: {
    showMenu() {
      return !this.isMounted || this.$vuetify.breakpoint.smAndDown;
    },
  },

  watch: {
    "$vuetify.theme.dark"(val) {
      if (window && window.localStorage) {
      	window.localStorage.setItem(STORAGE_KEY, val);
      }
    },
  },

  mounted() {
    this.isMounted = true;

    // On mount, pull dark-mode value.
    this.$vuetify.theme.dark = !localStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY) === "true";
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
