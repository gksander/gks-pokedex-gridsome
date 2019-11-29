// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/
const nodeExternals = require("webpack-node-externals");
const axios = require("axios");
const { capitalize, get } = require("lodash");
const path = require("path");
const csv = require("csvtojson");

// Config
const NUM_POKEMON = 384;
const INPUT_PATH = path.join(__dirname, "src/assets/data/csv");

const API_BASE = "http://localhost:6080/api/v2";

/**
 * Default export
 */
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
    const typeCollection = addCollection("Type");
    const damageFactorCollection = addCollection("DamageFactor");
    const pokemonCollection = addCollection("Pokemon");
    const speciesCollection = addCollection("Species");
    const generationsCollection = addCollection("Generation");
    const versionCollection = addCollection("Version");
    const versionGroupCollection = addCollection("VersionGroup");
    const evolutionChainCollection = addCollection("EvolutionChain");

    /**
     * Load in data first
     */
    const typesData = await csv().fromFile(path.join(INPUT_PATH, "types.csv"));
    const damageFactorData = await csv().fromFile(
      path.join(INPUT_PATH, "type_efficacy.csv"),
    );
    const speciesData = (
      await csv().fromFile(path.join(INPUT_PATH, "pokemon_species.csv"))
    ).filter(dat => parseInt(dat.id) <= NUM_POKEMON);
    const speciesFlavorData = (
      await csv().fromFile(
        path.join(INPUT_PATH, "pokemon_species_flavor_text.csv"),
      )
    ).filter(dat => parseInt(dat.species_id) <= NUM_POKEMON);
    const pokemonColorsData = await csv().fromFile(
      path.join(INPUT_PATH, "pokemon_colors.csv"),
    );
    const pokemonData = (
      await csv().fromFile(path.join(INPUT_PATH, "pokemon.csv"))
    ).filter(dat => parseInt(dat.id) <= NUM_POKEMON);
    const pokemonTypesData = (
      await csv().fromFile(path.join(INPUT_PATH, "pokemon_types.csv"))
    ).filter(dat => parseInt(dat.pokemon_id) <= NUM_POKEMON);
    const statsData = await csv().fromFile(path.join(INPUT_PATH, "stats.csv"));
    const pokemonStatsData = (
      await csv().fromFile(path.join(INPUT_PATH, "pokemon_stats.csv"))
    ).filter(dat => parseInt(dat.pokemon_id) <= NUM_POKEMON);

    /**
     * Set up types
     */
    for (let type of typesData) {
      // Make a record
      typeCollection.addNode({
        id: type.id,
        name: capitalize(type.identifier),
        slug: type.identifier,
      });
    }

    /**
     * Set up damage factors
     */
    for (let item of damageFactorData) {
      damageFactorCollection.addNode({
        damage_type: store.createReference("Type", item.damage_type_id),
        target_type: store.createReference("Type", item.target_type_id),
        damage_factor: item.damage_factor,
      });
    }

    /**
     * Pokemon species
     */
    for (let item of speciesData) {
      speciesCollection.addNode({
        id: item.id,
        color: pokemonColorsData.find(color => color.id == item.color_id)
          .identifier,
        flavor_text: (
          speciesFlavorData.find(dat => dat.species_id == item.id) || {
            flavor_text: "No description.",
          }
        ).flavor_text,
      });
    }

    /**
     * Pokemon
     */
    for (let pokemon of pokemonData) {
      // Build up stats details
      const stats = pokemonStatsData
        .filter(stat => stat.pokemon_id == pokemon.id)
        .map(stat => {
          const statDetail = statsData.find(dat => dat.id == stat.stat_id);

          return {
            base: stat.base_stat,
            name: statDetail.identifier
              .split("-")
              .map(capitalize)
              .join(" ")
              .replace(/^hp$/i, "HP")
              .replace(/special/i, "Sp."),
          };
        });

      pokemonCollection.addNode({
        id: pokemon.id,
        name: capitalize(pokemon.identifier),
        slug: pokemon.identifier.toLowerCase().replace(/ /g, "-"),
        height: Math.round((parseInt(pokemon.height) / 3.048) * 100) / 100, // Feet
        weight: Math.round((parseInt(pokemon.weight) / 4.536) * 100) / 100, // Lbs
        png: require.resolve(`./src/assets/img/poke-png/${pokemon.id}.png`),
        types: pokemonTypesData
          .filter(type => type.pokemon_id == pokemon.id)
          .map(type => store.createReference("Type", type.type_id)),
        stats,
        species: store.createReference("Species", pokemon.id),
        next_pokemon: store.createReference(
          "Pokemon",
          parseInt(pokemon.id) + 1,
        ),
        prev_pokemon: store.createReference(
          "Pokemon",
          parseInt(pokemon.id) - 1,
        ),
      });
    }
  });

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  });
};
