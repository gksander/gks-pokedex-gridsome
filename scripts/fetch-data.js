const fse = require("fs-extra");
const path = require("path");
const csv = require("csvtojson");

// Config
const NUM_POKEMON = 251;
const INPUT_DIR = path.join(__dirname, "../src/assets/data/csv");
const OUTPUT_DIR = path.join(__dirname, "../src/assets/data/json");

/**
 * Fetch data from JSON API and write to disk
 */
module.exports = async () => {
  /**
   * Types
   */
  const typesData = await csv().fromFile(path.join(INPUT_DIR, "types.csv"));
  await fse.writeJson(path.join(OUTPUT_DIR, "types.json"), typesData);

  /**
   * Pokemon
   */
  const pokemonData = await csv().fromFile(path.join(INPUT_DIR, "pokemon.csv"));
  await fse.writeJson(path.join(OUTPUT_DIR, "pokemon.json"), pokemonData);

  /**
   * Species
   */
  const speciesData = await csv().fromFile(
    path.join(INPUT_DIR, "pokemon_species.csv"),
  );
  await fse.writeJson(
    path.join(OUTPUT_DIR, "pokemon_species.json"),
    speciesData,
  );
};

module.exports();
