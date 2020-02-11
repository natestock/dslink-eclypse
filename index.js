const {DSLink, RootNode, ActionNode, BaseLocalNode} = require("dslink");
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
    let device = this.getDevice(IP);
    /*
    if (device) {
      let device = this.createChild(device.hostId, Device);
    } else {
      throw Error('Invalid device');
    }
    */
  }
  getDevice(ip) {
    request.get(`http://${ip}/api/rest/v1/info/device`).auth('admin', 'Maxair814', true)
    .on('error', (err) => {
      throw Error('404');
    })
    .on('response', (response) => {
      console.log(response.statusCode);
      console.log(response.headers);
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
