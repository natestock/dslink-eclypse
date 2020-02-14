const {RootNode, ActionNode, DsError} = require("dslink");
const {Device} = require("./device");
const ip = require("ip")
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
                node.update();
            }
        }
    }
  }
  
class AddDevice extends ActionNode {
    initialize() {  //set action parameters
      this.setConfig('$params', [
        {name: 'IP', type: 'string'},
        {name: 'User', type: 'string'},
        {name: 'Pass', type: 'pass'}
      ]);
    }
    async onInvoke(params, parentNode) {  //add device at IP
      let {IP, User, Pass} = params;
      if (ip.isV4Format(IP)){ //is valid IP
        if (User) {
          if (Pass) {
            return await get(IP, '/api/rest/v1/info/device', true, {user:User, pass:Pass, sendImmediately: true})
              .then(body => {
            //found eclypse device
                let device = parentNode.createChild(body.hostId, Device);
                device.setConfig('$ip', IP);
                device.setConfig('$user', User);
                device.setConfig('$pass', Pass);
                device.update();

                return body;
              }).catch(err => {
                console.log(err);
                if (err.message == 401) {
                  return new DsError('invalidInput', {msg: 'failed to authenticate'}); //unable to find eclypse device
                } else {
                  return new DsError('invalidInput', {msg: 'unable to connect to Eclypse device'}); //unable to find eclypse device
                }
              });
          } else {
            return new DsError('invalidInput', {msg: 'pass cannot be empty'}); //undefined user
          }
        } else {
          return new DsError('invalidInput', {msg: 'user cannot be empty'}); //undefined pass
        }
      } else {
        return new DsError('invalidInput', {msg: 'invalid IP address'}); //invalid IP
      }
    }
}

exports.Eclypse = Eclypse;