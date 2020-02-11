const {DSLink, RootNode, ActionNode} = require("dslink");
//const request = require('request');
//const rpn = require('request-promise-native');

class AddDevice extends ActionNode {
  initialize() {
    this.setConfig('$params', [
      {name: 'IP', type: 'string'}
    ]);
  }
  onInvoke(params, parentNode) {
    let {IP} = params;
  }
}
/*
class Device extends BaseLocalNode {
  constructor(path, provider) {
    super(path, provider);
    this.authenticate();
  }
  authenticate() {
    request.get('endpoint').auth('username', 'password', true)
    .on('response', (response) => {
      console.log(response);
    });
  }
}
*/
async function main() {
  let rootNode = new RootNode();
  rootNode.createChild('Add Device', AddDevice);
  let link = new DSLink('ECLYPSE', {rootNode});
  await link.connect();
}

main();
