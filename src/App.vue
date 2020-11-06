<template>
  <div class="h-screen overflow-hidden flex flex-col">
    <header
      :class="['p-2 transition-all duration-300', showHeaderShadow && 'shadow']"
    >
      <div class="container flex flex-row justify-between items-center">
        <div>
          <g-link
            to="/"
            class="flex items-center text-primary-800 px-3 py-2 rounded hover:bg-gray-100 transition-colors duration-150"
            exact
            active-class="bg-gray-100"
          >
            <div class="w-6 mr-2">
              <poke-ball />
            </div>
            <span class="font-bold text-lg">Pokedex</span>
          </g-link>
        </div>
        <div>
          <g-link
            v-for="link in links"
            :key="link.title"
            :to="link.to"
            class="px-3 py-2 text-primary-800 font-bold rounded hover:bg-gray-100 transition-colors duration-150"
            exact
            active-class="bg-gray-100"
            >{{ link.title }}</g-link
          >
        </div>
      </div>
    </header>
    <!-- Content body -->
    <div class="flex-grow overflow-auto" @scroll="onScroll">
      <router-view />
    </div>
  </div>
</template>

<script>
import PokeBall from "./components/PokeBall";

const STORAGE_KEY = "IS_DARK_MODE";

export default {
  components: { PokeBall },
  // Component data
  data() {
    return {
      links: [
        { title: "Search", to: "/search" },
        { title: "Types", to: "/types" },
        // { title: "Moves", to: "/moves" },
      ],
      isMounted: false,
      bodyScroll: 0,
    };
  },

  computed: {
    showMenu() {
      return !this.isMounted;
    },

    showHeaderShadow() {
      return this.bodyScroll > 0;
    },
  },

  methods: {
    onScroll(e) {
      this.bodyScroll = e?.target?.scrollTop || 0;
    },
  },

  watch: {
    // "$vuetify.theme.dark"(val) {
    //   if (window && window.localStorage) {
    //   	window.localStorage.setItem(STORAGE_KEY, val);
    //   }
    // },
  },

  mounted() {
    this.isMounted = true;

    // On mount, pull dark-mode value.
    // this.$vuetify.theme.dark = !localStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY) === "true";
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
