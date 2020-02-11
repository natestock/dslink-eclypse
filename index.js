const {DSLink, RootNode, ActionNode, BaseLocalNode, ValueNode, DsError} = require("dslink");
const request = require('request');
//const bodyParser = require('body-parser');
const rpn = require('request-promise-native');

class Eclypse extends RootNode {
  initialize() {
    this.createChild('Add Device', AddDevice);
  }
}

class AddDevice extends ActionNode {
  initialize() {
    this.setConfig('$params', [
      {name: 'IP', type: 'string'}
    ]);
  }
  async onInvoke(params, parentNode) {
    let {IP} = params;
    let options = {
      uri: `http://${IP}/api/rest/v1/info/device`,
      headers: {
        Authorization: 'Basic YWRtaW46TWF4YWlyODE0'
      },
      json: true
    };
    await rpn(options)
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
        return new DsError('invalidInput', {msg: 'invalid IP address'});
      });
  }  
}

class Device extends BaseLocalNode {
  constructor(path, provider) {
    super(path, provider);
  }
}

async function main() {
  let rootNode = new Eclypse();
  let link = new DSLink('ECLYPSE', { rootNode });
  await link.connect();
}

main();
