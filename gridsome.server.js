// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

const axios = require("axios");
const { capitalize, get } = require("lodash");
// Helper to pull ID from a URL
const getIdFromUrl = url => url.match(/(\d+)\/$/)[1];

// How many pokemon to pull
const NUM_POKEMON = 35;

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

  /**
   * Loading data
   */
  api.loadSource(async ({ addCollection, store }) => {
    /**
     * Create collections
     */
    const pokemonCollection = addCollection("Pokemon");
    const speciesCollection = addCollection("Species");
    const evolutionChainCollection = addCollection("EvolutionChain");
    const typeCollection = addCollection("Type");

    /**
     * References
     */
    pokemonCollection.addReference("species", "Species");
    speciesCollection.addReference("evolutionChain", "EvolutionChain");

    /**
     * Types
     * Fetch the list, then loop through to get each data
     */
    const {
      data: { results: types },
    } = await axios.get(`${API_BASE}/type`);
    for (let rec of types) {
      // Fetch the type data
      const { data: type } = await axios.get(rec.url);

      // Transform damage relations to reference other type nodes
      let relations = type.damage_relations;
      for (let i in relations) {
        relations[i] = relations[i].map(t =>
          store.createReference("Type", getIdFromUrl(t.url)),
        );
      }

      /**
       * Pokemon references
       */
      const pokemon = type.pokemon
        .map(piece => getIdFromUrl(piece.pokemon.url))
        .filter(id => id <= NUM_POKEMON)
        .map(id => store.createReference("Pokemon", id));

      // Make a record
      typeCollection.addNode({
        id: type.id,
        name: capitalize(type.name),
        damage_relations: relations,
        pokemon,
      });
    } // End of Type collection

    /**
     * Pokemon
     */
    const { data: pokemon } = await axios.get(
      `${API_BASE}/pokemon?limit=${NUM_POKEMON}`,
    );

    // Loop through each pokemon, fetch its data - and add a node
    for (let pokeDetail of pokemon.results) {
      const { data: pokemon } = await axios.get(pokeDetail.url);
      const { data: species } = await axios.get(
        `${API_BASE}/pokemon-species/${pokemon.id}`,
      );

      /**
       * Species data
       */
      speciesCollection.addNode({
        id: species.id,
        color: species.color,
        flavor_description: species.flavor_text_entries.find(
          entry => entry.language.name === "en",
        ).flavor_text,
        capture_rate: Math.round((species.capture_rate / 255) * 100) / 100,
      });

      /**
       * Pokemon data
       */
      const node = {
        id: pokemon.id,
        name: capitalize(pokemon.name),
        slug: pokemon.name.toLowerCase().replace(/ /g, "-"),
        height: Math.round((pokemon.height / 3.048) * 100) / 100, // Feet
        weight: Math.round((pokemon.weight / 4.536) * 100) / 100, // Lbs
        order: pokemon.order,
        sprite_front: require.resolve(
          `./src/assets/img/pokemon/${pokemon.id}.png`,
        ),
        sprite_back: require.resolve(
          `./src/assets/img/pokemon/back/${pokemon.id}.png`,
        ),
        svg: require.resolve(`./src/assets/img/poke-svg/${pokemon.id}.svg`),
        types: pokemon.types.map(piece => capitalize(piece.type.name)),
        stats: pokemon.stats.map(stat => ({
          base: stat.base_stat,
          name: stat.stat.name
            .split("-")
            .map(capitalize)
            .join(" ")
            .replace(/^hp$/i, "HP")
            .replace(/special/i, "Sp."),
        })),
        species: pokemon.id,
      };

      // Add the pokemon
      pokemonCollection.addNode(node);
    }

    // /**
    //  * Types
    //  */
    // const { data: types } = await axios.get(`${API_BASE}/type`);
    // const typesCollection = addCollection({ typeName: "Type" });
    //
    // for (let type of types.results) {
    //   typesCollection.addNode(type);
    // }
  });

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  });
};
