// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import InfiniteLoading from "vue-infinite-loading";
// User created
import DefaultLayout from "~/layouts/Default.vue";
import ContentWrapper from "~/components/ContentWrapper.vue";
import BottomBar from "~/components/BottomBar.vue";
import "./styles/global.css";

export default function(Vue, { appOptions, router, head, isClient }) {
  head.link.push({
    rel: "stylesheet",
    href: "https://use.fontawesome.com/releases/v5.0.13/css/all.css",
  });

  const opts = {
    icons: {
      iconfont: "fa",
    },
  }; //opts includes, vuetify themes, icons, etc.
  Vue.use(Vuetify);

  appOptions.vuetify = new Vuetify(opts);
  // Set default layout as a global component
  Vue.component("Layout", DefaultLayout);
  Vue.component("ContentWrapper", ContentWrapper);
  Vue.component("BottomBar", BottomBar);
  Vue.use(InfiniteLoading);
}
