const fse = require("fs-extra");
const path = require("path");
const fetch = require("node-fetch");

const BASE_PATH = "https://veekun.com/dex/media/pokemon/sugimori";
const OUT_DIR = path.resolve(__dirname, "../static/img/pokemon-sugimori");

module.exports = async () => {
  await fse.emptyDir(OUT_DIR);
  const reqs = Array.from({ length: 649 })
    .map((_, i) => i + 1)
    .map(pokeNum => {
      const outPath = path.join(OUT_DIR, `${pokeNum}.png`);
      return new Promise(async (resolve, reject) => {
        const res = await fetch(`${BASE_PATH}/${pokeNum}.png`);
        const fileStream = fse.createWriteStream(outPath);
        res.body.pipe(fileStream);
        res.body.on("error", err => reject(err));
        fileStream.on("finish", () => resolve());
      });
    });

  await Promise.all(reqs)
    .then(() => console.log("ALL FETCHED!"))
    .finally(() => process.exit());
};

module.exports();
