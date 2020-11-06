<template>
  <div>
    <header class="flex flex-row justify-between">
      <div>
        <g-link to="/">
          <g-image
            src="~/assets/img/pokeball.png"
            width="40"
            fit="contain"
            style="margin-right: 10px"
            alt="Pokeball image"
          />
        </g-link>
      </div>
      <div>
        <g-link v-for="link in links" :key="link.title" :to="link.to">{{
          link.title
        }}</g-link>
      </div>
    </header>
    <!-- Content body -->
    <router-view />
  </div>
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
      return !this.isMounted;
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
