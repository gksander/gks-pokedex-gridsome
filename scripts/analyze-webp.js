const fse = require("fs-extra");
const path = require("path");
const klaw = require("klaw");

module.exports = async () => {
  // Input/output paths
  const assetPath = path.resolve(__dirname, "../static/img/pokemon-sugimori");

  const toAnalyze = Array.from({ length: 649 })
    .map((_, i) => i + 1)
    .map(pokeNum => {
      return new Promise(async resolve => {
        try {
          const pngPath = path.join(assetPath, `${pokeNum}.png`);
          const webpPath = path.join(assetPath, `${pokeNum}.webp`);

          const pngSize = (await fse.stat(pngPath)).size;
          const webpSize = (await fse.stat(webpPath)).size;

          resolve([pngSize, webpSize]);
        } catch {
          resolve([0, 0]);
        }
      });
    });

  await Promise.all(toAnalyze)
    .then(sizes =>
      sizes.reduce(
        (acc, size) => {
          acc[0] += size[0];
          acc[1] += size[1];
          return acc;
        },
        [0, 0],
      ),
    )
    .then(([aggPngSize, aggWebpSize]) => {
      console.log(
        `PNG size: ${(aggPngSize / Math.pow(1024, 2)).toFixed(3)} MB`,
      );
      console.log(
        `WEBP size: ${(aggWebpSize / Math.pow(1024, 2)).toFixed(3)} MB`,
      );
      console.log(
        `WEBP is ${((aggWebpSize / aggPngSize) * 100).toFixed(2)}% of PNG`,
      );
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      console.log("DONE");
      process.exit();
    });
};

module.exports();
