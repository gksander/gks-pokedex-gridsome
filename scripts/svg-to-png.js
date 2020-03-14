const sharp = require("sharp");
const fse = require("fs-extra");
const klaw = require("klaw");
const path = require("path");

/**
 * Function to slice and dice SVGs
 */
module.exports = async () => {
  await new Promise(async resolve => {
    // Input/output paths
    const assetPath = path.resolve(__dirname, "../src/assets/img/poke-svg");
    const outputPath = path.resolve(__dirname, "../src/assets/img/poke-png");

    // Walk through the asset path...
    await klaw(assetPath)
      .on("data", async item => {
        // For each item, use sharp to convert to PNG
        try {
        	const fileExists = await fse.pathExists(item.path.replace(/poke-svg/, "poke-png").replace(/svg$/, 'png'));
          if (!fileExists) {
          	console.log(`Converting ${item.path} to png`);
            await sharp(item.path)
              .resize(500, 500, { fit: "inside" })
              .toFile(
                path.join(
                  outputPath,
                  path.basename(item.path).replace(/svg$/, "png"),
                ),
              );
          }
        } catch (error) {
          console.log(`Error on ${item.path}`, error);
        }
      })
      .on("end", resolve);
  });
};

module.exports();
