const path = require("path");
const klaw = require("klaw");
const Vibrant = require("node-vibrant");
const fse = require("fs-extra");

/**
 * Crawl through the pokemon images and extract vibrant colors.
 * Will write this data to a JSON file.
 */
module.exports = async () => {
  // Input/output paths
  const assetPath = path.resolve(__dirname, "../static/img/pokemon-sugimori");
  const outputPath = path.resolve(
    __dirname,
    "../src/assets/data/pokemon-colors.json",
  );
  const colorHash = {};

  // Do the handling
  await new Promise(resolve => {
    klaw(assetPath)
      .on("data", async item => {
        if (!/png$/.test(item.path)) return;

        try {
          const palette = await Vibrant.from(item.path).getPalette();
          const id = item.path.match(/(\d+)\.png/)[1];

          colorHash[id] = palette;
        } catch (_) {}
      })
      .on("end", resolve);
  });

  await fse.writeJSON(outputPath, colorHash);

  console.log("Done extracting colors!");
};

module.exports();
