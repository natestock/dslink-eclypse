const {DSLink, RootNode, ActionNode, BaseLocalNode, ValueNode} = require("dslink");
const request = require('request');
//const bodyParser = require('body-parser');
//const rpn = require('request-promise-native');

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
  onInvoke(params, parentNode) {
    let {IP} = params;
    request.get(`http://${IP}/api/rest/v1/info/device`).auth('admin', 'Maxair814', true)
    .on('error', (err) => {
      throw Error('404');
    })
    .on('response', (response) => {
      let body = '';
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () => {
        let jsonBody = JSON.parse(body);
        let device = parentNode.createChild(jsonBody.hostId, Device);
        device.setConfig('name', jsonBody.hostName);
        Object.keys(jsonBody).forEach(key => {
          let prop = device.createChild(key, ValueNode);
          prop.setValue(jsonBody[key]);
        });
      });
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
