// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: "GKS",
  plugins: [
    // {
    //   use: "gridsome-plugin-pwa",
    //   options: {
    //     title: "Gridsome",
    //     startUrl: "/",
    //     display: "standalone",
    //     statusBarStyle: "default",
    //     manifestPath: "manifest.json",
    //     serviceWorkerPath: "service-worker.js",
    //     cachedFileTypes: "js,json,css,html,png,jpg,jpeg,svg",
    //     shortName: "Gridsome",
    //     themeColor: "#666600",
    //     backgroundColor: "#ffffff",
    //     icon: "", // must be provided
    //     msTileImage: "",
    //     msTileColor: "#666600",
    //   },
    // },
  ],
  // Templates to render out for given Edge types
  templates: {
    Pokemon: [
      {
        path: node => {
          return `/${node.slug}`;
        },
      },
    ],
    Type: [
      {
        path: node => {
          return `/types/${node.slug}`;
        },
      },
    ],
  },
};
