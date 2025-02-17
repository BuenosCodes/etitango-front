const { readFile, writeFile } = require('node:fs/promises');

async function run() {
  const text = await readFile('./argentina_localities.json', {encoding: 'utf-8'});
  const json = JSON.parse(text);

  const provinces = {}
  for (let c of json) {
    if (! provinces[c.code]) {
      provinces[c.code] = [c.name]
    } else {
      provinces[c.code].push(c.name)
    }
  }
  const promises = Object.keys(provinces).map(k =>
    writeFile(`./argentina_localities_${k}.json`, JSON.stringify(provinces[k], null, 4)))
  await Promise.all(promises)
}
run();
