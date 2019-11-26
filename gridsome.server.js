// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

const axios = require("axios");
const { capitalize } = require("lodash");

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const API_BASE = "http://localhost:6080/api/v2";

module.exports = function(api) {
  /**
   * Extending Webpack for Vuetify
   */
  api.chainWebpack((config, { isServer }) => {
    if (isServer) {
      config.externals([
        nodeExternals({
          whitelist: [/^vuetify/],
        }),
      ]);
    }
  });

  api.loadSource(async ({ addCollection }) => {
    /**
     * Pokemon
     */
    const { data: pokemon } = await axios.get(`${API_BASE}/pokemon?limit=50`);

    // Create pokemon collection
    const pokemonCollection = addCollection({
      typeName: "Pokemon",
    });

    // Loop through each pokemon, fetch its data - and add a node
    for (let pokeDetail of pokemon.results) {
      const { data: pokemon } = await axios.get(pokeDetail.url);

      const node = {
        id: pokemon.id,
        name: capitalize(pokemon.name),
        height: pokemon.height,
        weight: pokemon.weight,
        order: pokemon.order,
        sprite_front: require.resolve(
          `./src/assets/img/pokemon/${pokemon.id}.png`,
        ),
        sprite_back: require.resolve(
          `./src/assets/img/pokemon/back/${pokemon.id}.png`,
        ),
        types: pokemon.types.map(piece => capitalize(piece.type.name)),
        stats: pokemon.stats.map(stat => ({
          base: stat.base_stat,
          name: stat.stat.name
            .split("-")
            .map(capitalize)
            .join(" "),
        })),
      };

      // Add the pokemon
      pokemonCollection.addNode(node);
    }

    /**
     * Types
     */
    const { data: types } = await axios.get(`${API_BASE}/type`);
    const typesCollection = addCollection({ typeName: "Type" });

    for (let type of types.results) {
      typesCollection.addNode(type);
    }
  });

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  });
};
