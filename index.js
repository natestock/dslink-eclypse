const {DSLink} = require("dslink");
const {Eclypse} = require("./src/eclypse");

async function main() {
  let rootNode = new Eclypse();
  let link = new DSLink('ECLYPSE', { rootNode });
  await link.connect();
}

main();