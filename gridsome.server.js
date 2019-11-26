// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

const axios = require("axios");

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const API_BASE = "http://localhost:6080/api/v2";

module.exports = function(api) {
  api.loadSource(async ({ addCollection }) => {
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api/
    const { data } = await axios.get(`${API_BASE}/pokemon?limit=9`);

    // Create pokemon collection
    const pokemonCollection = addCollection({
      typeName: "Pokemon",
    });

    // Loop through each pokemon, fetch its data - and add a node
    for (let pokeDetail of data.results) {
      const { data: pokemon } = await axios.get(pokeDetail.url);

      const node = {
        id: pokemon.id,
        name: pokemon.name,
        height: pokemon.height,
        weight: pokemon.weight,
        order: pokemon.order,
        sprite_front: require.resolve(
          `./src/assets/img/pokemon/${pokemon.id}.png`,
        ),
        sprite_back: require.resolve(
          `./src/assets/img/pokemon/back/${pokemon.id}.png`,
        ),
      };

      // Add the pokemon
      pokemonCollection.addNode(node);
    }
  });

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  });
};
