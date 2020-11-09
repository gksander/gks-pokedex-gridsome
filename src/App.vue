<template>
  <div
    :style="{
      backgroundColor: 'var(--background-color)',
    }"
    class="min-h-screen transition-colors duration-150"
  >
    <header
      :class="[
        'p-2 transition-all duration-150 sticky top-0 z-10',
        showHeaderShadow && 'shadow',
      ]"
      :style="{
        backgroundColor: 'var(--background-color)',
      }"
    >
      <div
        class="container max-w-2xl flex flex-row justify-between items-center"
      >
        <div>
          <g-link
            to="/"
            class="flex items-center text-primary-800 px-3 py-2 rounded border-2 border-transparent hover:border-primary-800 transition-colors duration-150 homeLink"
            exact
            active-class="border-primary-800"
          >
            <div class="w-6 mr-2">
              <poke-ball class="pokeball transition-all duration-300" />
            </div>
            <span class="font-bold text-lg">Pokedex</span>
          </g-link>
        </div>
        <div>
          <g-link
            v-for="link in links"
            :key="link.title"
            :to="link.to"
            class="px-3 py-2 text-primary-800 font-bold rounded transition-colors duration-150 border-2 border-transparent hover:border-primary-800"
            exact
            active-class="border-primary-800"
            >{{ link.title }}</g-link
          >
        </div>
      </div>
    </header>
    <!-- Content body -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import PokeBall from "./components/PokeBall";
import { setBackgroundColor } from "./util/setBackgroundColor";

const STORAGE_KEY = "IS_DARK_MODE";

export default {
  components: { PokeBall },
  // Component data
  data() {
    return {
      links: [
        { title: "Search", to: "/search" },
        { title: "Types", to: "/types" },
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
    onScroll() {
      this.bodyScroll = window.scrollY || 0;
    },

    setBgColorIfNecessary() {
      const val = this.$route.path;

      if (["/", "/search"].includes(val) || val.startsWith("/types")) {
        setBackgroundColor("white");
      }
    },
  },

  watch: {
    "$route.path"() {
      this.setBgColorIfNecessary();
    },
  },

  mounted() {
    this.isMounted = true;
    window.addEventListener("scroll", this.onScroll);
    this.setBgColorIfNecessary();
  },

  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
  },
};
</script>

<style>
.homeLink:hover .pokeball {
  transform: rotate(180deg);
}
</style>

<static-query>
  query {
  metadata {
  siteName
  }
  }
</static-query>
