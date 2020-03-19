const path = require("path");
const klaw = require("klaw");
const Vibrant = require("node-vibrant");
const sharp = require("sharp");
const fse = require("fs-extra");

module.exports = async () => {
  // Input/output paths
  const assetPath = path.resolve(__dirname, "../static/img/pokemon");
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
          const buffer = await sharp(item.path).toBuffer();
          const palette = await Vibrant.from(buffer).getPalette();
          const id = item.path.match(/(\d+)\.svg/)[1];

          colorHash[id] = palette;
        } catch (_) {}
      })
      .on("end", resolve);
  });

  await fse.writeJSON(outputPath, colorHash);

  console.log("Done extracting colors!");
};

module.exports();
