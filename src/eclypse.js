const {RootNode, ActionNode, DsError} = require("dslink");
const {Device} = require("./device");
const {ip} = require("ip")
const {get} = require("./request");

class Eclypse extends RootNode {
    initialize() {  //add actions to node
      this.createChild('Add Device', AddDevice);
    }
    loadChild(name, data) { //add serialized devices
        if (!this.children.has(name)) {
            if (data['$is'] === Device.profileName) {
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
      if (ip.isV4Format(IP)){ //is valid IP
        return await get(IP, '/api/rest/v1/info/device', false)
          .then(body => {
            let device = parentNode.createChild(body.hostId, Device);
            return device;
          }).catch(err => {
            return DsError('invalidInput', {mess: 'unable to find Eclypse device'}); //unable to find eclypse device
          });
        parentNode.createChild(IP, Device);
      } else {
        return DsError('invalidInput', {mess: 'invalid IP address'}); //invalid IP
      }
    }
}

exports.Eclypse = Eclypse;