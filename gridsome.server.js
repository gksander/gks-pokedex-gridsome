// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/
const nodeExternals = require("webpack-node-externals");
const { capitalize } = require("lodash");
const path = require("path");
const csv = require("csvtojson");

// Config
const NUM_POKEMON =
  {
    starters: 9,
    gen1: 151,
    gen2: 251,
    gen3: 384,
    gen4: 491,
    gen5: 649,
  }["gen5"] || 9;
const DATA_DIR = path.join(__dirname, "src/assets/data/csv");

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
    const evolutionChainCollection = addCollection("EvolutionChain");

    /**
     * Load in data first
     */
    // Types
    const typesData = await csv().fromFile(path.join(DATA_DIR, "types.csv"));
    // Damage factors (how strong types are against each other)
    const damageFactorData = (
      await csv().fromFile(path.join(DATA_DIR, "type_efficacy.csv"))
    ).map(item => ({
      id: `${item.damage_type_id}.${item.target_type_id}`,
      ...item,
    }));
    // Pokemon species
    const speciesData = (
      await csv().fromFile(path.join(DATA_DIR, "pokemon_species.csv"))
    ).filter(dat => parseInt(dat.id) <= NUM_POKEMON);
    // Species "Flavor" info, to get description
    const speciesFlavorData = (
      await csv().fromFile(
        path.join(DATA_DIR, "pokemon_species_flavor_text.csv"),
      )
    ).filter(dat => parseInt(dat.species_id) <= NUM_POKEMON);
    // The colors of pokemon
    const pokemonColorsData = await csv().fromFile(
      path.join(DATA_DIR, "pokemon_colors.csv"),
    );
    // Pokemon themselves
    const pokemonData = (
      await csv().fromFile(path.join(DATA_DIR, "pokemon.csv"))
    ).filter(dat => parseInt(dat.id) <= NUM_POKEMON);
    // Pivot table for pokemon and types
    const pokemonTypesData = (
      await csv().fromFile(path.join(DATA_DIR, "pokemon_types.csv"))
    ).filter(dat => parseInt(dat.pokemon_id) <= NUM_POKEMON);
    // Stat information
    const statsData = await csv().fromFile(path.join(DATA_DIR, "stats.csv"));
    // Pivot table for pokemon and stats
    const pokemonStatsData = (
      await csv().fromFile(path.join(DATA_DIR, "pokemon_stats.csv"))
    ).filter(dat => parseInt(dat.pokemon_id) <= NUM_POKEMON);
    // Evolution chains
    const evolutionChainsData = await csv().fromFile(
      path.join(DATA_DIR, "evolution_chains.csv"),
    );
    // Details about evolutions (level, etc.). Not currently using it.
    const pokemonEvolutionData = (
      await csv().fromFile(path.join(DATA_DIR, "pokemon_evolution.csv"))
    ).filter(dat => parseInt(dat.evolved_species_id) <= NUM_POKEMON);

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
        id: item.id,
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
          speciesFlavorData.find(
            dat => dat.species_id == item.id && dat.language_id == 9,
          ) || {
            flavor_text: "No description.",
          }
        ).flavor_text.replace(/[\n\r\f]/g, " "),
        pokemon: store.createReference("Pokemon", item.id),
        evolves_from: store.createReference(
          "Species",
          item.evolves_from_species_id,
        ),
        is_baby: item.is_baby,
        evolution_chain: store.createReference(
          "EvolutionChain",
          item.evolution_chain_id,
        ),
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

      // Types
      const types = pokemonTypesData.filter(
        type => type.pokemon_id == pokemon.id,
      );
      const typesIds = types.map(type => type.type_id);

      // All damage relations for the given pokemon
      const damage_factors = damageFactorData
        .filter(dat => typesIds.includes(dat.target_type_id))
        .map(factor => store.createReference("DamageFactor", factor.id));

      pokemonCollection.addNode({
        id: pokemon.id,
        name: capitalize(pokemon.identifier),
        slug: pokemon.identifier.toLowerCase().replace(/ /g, "-"),
        height: Math.round((parseInt(pokemon.height) / 3.048) * 100) / 100, // Feet
        weight: Math.round((parseInt(pokemon.weight) / 4.536) * 100) / 100, // Lbs
        png: require.resolve(`./src/assets/img/poke-png/${pokemon.id}.png`),
        types: types.map(type => store.createReference("Type", type.type_id)),
        damage_factors,
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

    /**
     * Evolution chains...
     */
    const speciesToEvChainLink = species => {
      return {
        species: store.createReference("Species", species.id),
        evolves_from: store.createReference(
          "Species",
          species.evolves_from_species_id,
        ),
      };
    };
    for (let chain of evolutionChainsData) {
      // Find the first species in the chain
      const speciesInChain = speciesData.filter(
        species => species.evolution_chain_id == chain.id,
      );
      if (!speciesInChain.length) continue;

      evolutionChainCollection.addNode({
        id: chain.id,
        baby_trigger_item: null, // TODO: handle this...
        links: speciesInChain.map(speciesToEvChainLink),
      });
    }
  });

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  });
};
