const sharp = require("sharp");
const fse = require("fs-extra");
const klaw = require("klaw");
const path = require("path");

/**
 * Function to slice and dice
 */
module.exports = async () => {
  await new Promise(async resolve => {
    // Input/output paths
    const assetPath = path.resolve(__dirname, "../src/assets/img/poke-svg");
    const outputPath = path.resolve(__dirname, "../src/assets/img/poke-png");

    // Dump the output
    await fse.emptyDir(outputPath);

    await klaw(assetPath)
      .on("data", item => {
        try {
          sharp(item.path)
            .resize(500, 500, { fit: "inside" })
            .toFile(
              path.join(
                outputPath,
                path.basename(item.path).replace(/svg$/, "png"),
              ),
            );
        } catch (error) {
          console.log(`Error on ${item.path}`, error);
        }
      })
      .on("end", resolve);
  });
};

module.exports();
