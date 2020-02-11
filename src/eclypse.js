const {RootNode, ActionNode, DsError} = require("dslink");
const rpn = require('request-promise-native');
const {Device} = require("./device");

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
        json: true,
        resolveWithFullResponse: true,
        timeout: 5000
      };
      return await rpn(options)
        .then(response => {
            console.log(response);
          //return this.addDevice(parentNode, data);
        })
        .catch(err => {
            console.log(err)
          return new DsError('invalidInput', {msg: 'Invalid IP address'});
        });
    }
    addDevice(parentNode, data) {
      let device = parentNode.createChild(data.hostId, Device);
      device.setConfig('name', data.HostName);
      device.setConfig('auth', data)
    }
}

exports.Eclypse = Eclypse;