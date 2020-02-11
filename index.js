const {DSLink, RootNode, BaseLocalNode, ActionNode} = require("dslink");
const request = require('request');
const rpn = require('request-promise-native');

class Eclypse extends RootNode {
  initialize() {
    this.createChild('Add Device', AddDevice);
  }
}

class AddDevice extends ActionNode {
  initialize() {
    this.setConfig('$params', [
      {name: 'IP', type: 'string'},
      {name: 'username', type: 'string'},
      {name: 'password', type: 'string'}
    ]);
  }
  onInvoke(params, parentNode) {
    let {IP} = params;
  }
}

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

function main() {
  let eclypseRoot = new Eclypse();
  let link = new DSLink('ECLYPSE', {eclypseRoot});
  link.connect();
}

main();
