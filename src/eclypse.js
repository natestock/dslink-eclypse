const {RootNode, ActionNode, ValueNode, DsError} = require("dslink");
const rpn = require('request-promise-native');
const {Device, Property} = require("./device");

class Eclypse extends RootNode {
    initialize() {  //add actions to node
      this.createChild('Add Device', AddDevice);
    }
    loadChild(name, data) { //add serialized devices
        if (!this.children.has(name)) {
            if (data['$is'] === 'device') {
                let node = this.createChild(name, Device);
                node.load(data);
            }
        }
    }
  }
  
class AddDevice extends ActionNode {
    initialize() {  //set action parameters
      this.setConfig('$params', [
        {name: 'IP', type: 'string'}
      ]);
    }
    async onInvoke(params, parentNode) {  //add device at IP
      let {IP} = params;
      let options = { //GET request options
        uri: `http://${IP}/api/rest/v1/info/device`,  //endpoint
        headers: {
          Authorization: 'Basic YWRtaW46TWF4YWlyODE0' //HTTP Basic auth, user: admin, pass: Maxair814
        },
        json: true, //parse body to JSON
        resolveWithFullResponse: true,  //include full response
        timeout: 5000 //timeout 5s
      };
      return await rpn(options) //return added device or DsError
        .then(response => {
            let {headers, body} = response;
            let device = parentNode.createChild(body.hostId, Device); //add device
            device.setConfig('name', body.hostName);  //set display name
            device.setConfig('ip', IP)
            device.setConfig('set-cookie', headers['set-cookie'][0]);
            Object.keys(body).forEach(key => {  //add device properties
                let prop = device.createChild(key, Property);
                prop.setValue(body[key]);
            });
            return device;
        })
        .catch(err => {
            console.log(err);
            return new DsError('invalidInput', {msg: 'Invalid IP address'});  //general error
        });
    }
}

exports.Eclypse = Eclypse;