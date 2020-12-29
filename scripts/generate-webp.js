const sharp = require("sharp");
const path = require("path");
const klaw = require("klaw");

/**
 * Function to slice and dice SVGs
 */
module.exports = async () => {
  await new Promise(async resolve => {
    // Input/output paths
    const assetPath = path.resolve(__dirname, "../static/img/pokemon-sugimori");
    const outputPath = assetPath;

    // Walk through the asset path...
    await klaw(assetPath)
      .on("data", async item => {
        if (/webp$/.test(item.path)) return;

        // For each item, use sharp to convert to PNG
        try {
          const fileExists = await fse.pathExists(
            item.path.replace(/png$/, "webp"),
          );
          if (!fileExists) {
            console.log(`Converting ${item.path} to webp`);
            await sharp(item.path)
              // .resize(800, 800, { fit: "inside" })
              .toFile(
                path.join(
                  outputPath,
                  path.basename(item.path).replace(/png$/, "webp"),
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
