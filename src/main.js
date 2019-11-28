// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api
import "@fortawesome/fontawesome-free/css/all.css"; // Ensure you are using css-loader
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import DefaultLayout from "~/layouts/Default.vue";

export default function(Vue, { appOptions, router, head, isClient }) {
  // head.link.push({
  //   rel: "stylesheet",
  //   href: "https://fonts.googleapis.com/icon?family=Material+Icons",
  // });

  const opts = {
    icons: {
      iconfont: "fa",
    },
  }; //opts includes, vuetify themes, icons, etc.
  Vue.use(Vuetify);

  appOptions.vuetify = new Vuetify(opts);
  // Set default layout as a global component
  Vue.component("Layout", DefaultLayout);
}
