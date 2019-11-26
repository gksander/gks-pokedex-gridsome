// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

// const tailwindcss = require("tailwindcss");
// const purgecss = require("@fullhuman/postcss-purgecss");

module.exports = {
  siteName: "Gridsome",
  plugins: [],
  templates: {
    Pokemon: "/pokemon/:id",
  },
  // css: {
  //   loaderOptions: {
  //     postcss: {
  //       plugins: [
  //         tailwindcss,
  //         ...(process.env.NODE_ENV === "production" ? [purgecss] : []),
  //       ],
  //     },
  //   },
  // },
};
