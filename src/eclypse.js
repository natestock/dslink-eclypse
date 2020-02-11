const {RootNode, ActionNode, DsError} = require("dslink");
const request = require('request');
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
        timeout: 5000
      };
      return await rpn(options)
        .then(response => {
          return this.addDevice(parentNode, response);
        })
        .catch(err => {
            console.log(err)
          return new DsError('invalidInput', {msg: 'Invalid IP address'});
        });
    }
    addDevice(parentNode, props) {
      let device = parentNode.createChild(props.hostId, Device);
      device.setConfig('name', props.HostName);
    }
}

exports.Eclypse = Eclypse;