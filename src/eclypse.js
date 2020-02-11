const {RootNode, ActionNode, ValueNode, DsError} = require("dslink");
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
            let {headers, body} = response;
            let device = parentNode.createChild(body.hostId, Device);
            device.setConfig('name', body.hostName);
            device.setConfig('set-cookie', headers['set-cookie']);
            Object.keys(body).forEach(key => {
                let prop = device.createChild(key, ValueNode);
                prop.setValue(body[key]);
            });
            return device;
        })
        .catch(err => {
            console.log(err);
            return new DsError('invalidInput', {msg: 'Invalid IP address'});
        });
    }
}

exports.Eclypse = Eclypse;