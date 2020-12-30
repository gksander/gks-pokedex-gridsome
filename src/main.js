// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api
import InfiniteLoading from "vue-infinite-loading";
// User created
import DefaultLayout from "~/layouts/Default.vue";
import "./styles/global.css";
import "typeface-kalam";

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
  Vue.use(InfiniteLoading);

  Vue.component("font-awesome-icon", FontAwesomeIcon);
}
