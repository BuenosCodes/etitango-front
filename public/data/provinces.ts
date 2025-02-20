const { readFile, writeFile } = require('node:fs/promises');

async function run() {
  const text = await readFile('./argentina_states.json', {encoding: 'utf-8'});
  const json = JSON.parse(text);

  const provinces = {}
  for (let c of json) {
    provinces[c.name] = c.code
  }
  console.error(JSON.stringify(provinces, null, 4))
}
run();
