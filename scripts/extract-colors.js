const path = require("path");
const klaw = require("klaw");
const Vibrant = require("node-vibrant");
const fse = require("fs-extra");

module.exports = async () => {
  // Input/output paths
  const assetPath = path.resolve(__dirname, "../src/assets/img/poke-png");
  const outputPath = path.resolve(
    __dirname,
    "../src/assets/data/pokemon-colors.json",
  );
  const colorHash = {};

  // Do the handling
  await new Promise(resolve => {
    klaw(assetPath)
      .on("data", async item => {
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
