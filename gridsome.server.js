// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/
const nodeExternals = require("webpack-node-externals");
const axios = require("axios");
const { capitalize, get } = require("lodash");
// Helper to pull ID from a URL
const getIdFromUrl = url => url.match(/(\d+)\/$/)[1];

// How many pokemon to pull
const NUM_POKEMON = 25;

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
    const generationsCollection = addCollection("Generation");
    const typeCollection = addCollection("Type");
    const versionCollection = addCollection("Version");
    const versionGroupCollection = addCollection("VersionGroup");
    const evolutionChainCollection = addCollection("EvolutionChain");

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
        slug: type.name,
        damage_relations: relations,
        pokemon,
      });
    } // End of Type collection

    /**
     * Pokemon Species
     */
    const { data: species } = await axios.get(
      `${API_BASE}/pokemon-species?limit=${NUM_POKEMON}`,
    );
    // Loop through the species to fetch data
    for (let spec of species.results) {
      const { data: species } = await axios.get(spec.url);

      // Add the species
      speciesCollection.addNode({
        id: species.id,
        color: species.color,
        flavor_description: species.flavor_text_entries.find(
          entry => entry.language.name === "en",
        ).flavor_text,
        capture_rate: Math.round((species.capture_rate / 255) * 100) / 100,
      });
    }

    /**
     * Pokemon
     */
    const { data: pokemon } = await axios.get(
      `${API_BASE}/pokemon?limit=${NUM_POKEMON}`,
    );
    // Loop through each pokemon, fetch its data - and add a node
    for (let pokeDetail of pokemon.results) {
      const { data: pokemon } = await axios.get(pokeDetail.url);

      // Add the pokemon
      pokemonCollection.addNode({
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
        types: pokemon.types.map(piece =>
          store.createReference("Type", getIdFromUrl(piece.type.url)),
        ),
        stats: pokemon.stats.map(stat => ({
          base: stat.base_stat,
          name: stat.stat.name
            .split("-")
            .map(capitalize)
            .join(" ")
            .replace(/^hp$/i, "HP")
            .replace(/special/i, "Sp."),
        })),
        species: store.createReference("Species", pokemon.id),
        next_pokemon: store.createReference("Pokemon", pokemon.id + 1),
        prev_pokemon: store.createReference("Pokemon", pokemon.id - 1),
      });
    } // End Pokemon

    /**
     * Generations
     */
    const {
      data: { results: generations },
    } = await axios.get(`${API_BASE}/generation`);
    // Loop through generations
    for (let res of generations) {
      const { data: gen } = await axios.get(res.url);

      // Determine english name
      const genName = gen.names.find(name => name.language.name === "en").name;

      // Pokemon references
      const pokemon = gen.pokemon_species
        .map(piece => getIdFromUrl(piece.url))
        .filter(id => id <= NUM_POKEMON)
        .map(id => store.createReference("Pokemon", id));

      // Version groups
      const version_groups = gen.version_groups.map(group =>
        store.createReference("VersionGroup", getIdFromUrl(group.url)),
      );

      // Add node
      generationsCollection.addNode({
        id: gen.id,
        name: genName,
        slug: genName.toLowerCase().replace(/ /g, "-"),
        pokemon,
        version_groups,
      });
    }

    /**
     * Versions
     */
    const {
      data: { results: versions },
    } = await axios.get(`${API_BASE}/version?limit=50`);
    // Loop through the versions
    for (let res of versions) {
      // Fetch version data
      const { data: version } = await axios.get(res.url);

      // Version name
      const versionName = version.names.find(
        name => name.language.name === "en",
      ).name;

      // Build node
      versionCollection.addNode({
        id: version.id,
        name: versionName,
        slug: versionName.toLowerCase().replace(/ /g, "-"),
        version_group: store.createReference(
          "VersionGroup",
          getIdFromUrl(version.version_group.url),
        ),
      });
    }

    /**
     * Version groups
     */
    const {
      data: { results: groups },
    } = await axios.get(`${API_BASE}/version-group?limit=50`);
    // Loop through
    for (let res of groups) {
      // Get version group
      const { data: group } = await axios.get(res.url);

      // Name of the group
      const groupName = group.name
        .split("-")
        .map(capitalize)
        .join(" ");

      // Versions
      const versions = group.versions.map(version =>
        store.createReference("Version", getIdFromUrl(version.url)),
      );

      versionGroupCollection.addNode({
        id: group.id,
        slug: group.name,
        name: groupName,
        versions,
      });
    }

    /**
     * Evolution chains
     */
    //   const {
    //     data: { results: chains },
    //   } = await axios.get(`${API_BASE}/evolution-chain?limit=5`);
    //   // Loop through the chains
    //   for (let res of chains) {
    //     // Fetch ev chain
    //     let { data: chain } = await axios.get(res.url);
    //
    //     // Create the node
    //     const node = {
    //       id: chain.id,
    //       chain: [],
    //     };
    //
    //     // Start creating links (first has no evolution details)
    //     node.chain.push({
    //       pokemon: store.createReference(
    //         "Pokemon",
    //         getIdFromUrl(chain.species.url),
    //       ),
    //       evolution_details: null,
    //     });
    //
    //
    //     // Add the node
    //     evolutionChainCollection.addNode(chain);
    //   }
  });

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  });
};
