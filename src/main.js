// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import InfiniteLoading from "vue-infinite-loading";
// User created
import DefaultLayout from "~/layouts/Default.vue";
import ContentWrapper from "~/components/ContentWrapper.vue";
import "./styles/global.css";

// Handle fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faHome,
  faChevronLeft,
  faChevronRight,
  faListAlt,
  faStar,
  faChevronDown,
  faRulerVertical,
  faWeight,
  faCaretDown,
  faCaretRight,
  faCaretLeft,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";

// Register FA icons
library.add(
  faHome,
  faBars,
  faChevronLeft,
  faChevronRight,
  faListAlt,
  faStar,
  faChevronDown,
  faRulerVertical,
  faWeight,
  faCaretDown,
  faCaretRight,
  faCaretLeft,
  faSun,
  faMoon,
);

export default function(Vue, { appOptions, router, head, isClient }) {
  // Make a few components globally accessible
  Vue.component("Layout", DefaultLayout);
  Vue.component("ContentWrapper", ContentWrapper);
  Vue.use(InfiniteLoading);

  // Icon values (for registering with Vuetify)
  const iconValues = [
    { key: "menu", icon: ["fa", "bars"] },
    { key: "home", icon: ["fa", "home"] },
    { key: "left", icon: ["fa", "chevron-left"] },
    { key: "prev", icon: ["fa", "caret-left"] },
    { key: "right", icon: ["fa", "chevron-right"] },
    { key: "next", icon: ["fa", "caret-right"] },
    { key: "down", icon: ["fa", "chevron-down"] },
    { key: "list", icon: ["fa", "list-alt"] },
    { key: "star", icon: ["fa", "star"] },
    { key: "sort", icon: ["fa", "caret-down"] },
    { key: "height", icon: ["fa", "ruler-vertical"] },
    { key: "weight", icon: ["fa", "weight"] },
    { key: "dropdown", icon: ["fa", "caret-down"] },
    { key: "sun", icon: ["fa", "sun"] },
    { key: "moon", icon: ["fa", "moon"] },
  ].reduce((obj, val) => {
    obj[val.key] = {
      component: FontAwesomeIcon,
      props: {
        icon: val.icon,
      },
    };
    return obj;
  }, {});

  // Set up Vuetify
  Vue.use(Vuetify);
  appOptions.vuetify = new Vuetify({
    icons: {
      iconfont: "faSvg",
      values: iconValues,
    },
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: "#8c1a00",
        },
      },
      options: {
        minifyTheme: function(css) {
          return process.env.NODE_ENV === "production"
            ? css.replace(/[\r\n|\r|\n]/g, "")
            : css;
        },
      },
    },
  });
}
