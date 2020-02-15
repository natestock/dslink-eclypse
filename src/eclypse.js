const {RootNode, ActionNode, DsError} = require("dslink");
const {Device} = require("./device/device");
const ip = require("ip");
const rpn = require('request-promise-native');
const {Base64} = require("js-base64");
// manages the adding of new devices
// contains the root api method, stores authentication cookies
class Eclypse extends RootNode {
  // *************************************************************
  async get(method, ip, route, auth) {  //root method to return api body
    let endpoint = '';
    switch(method) {
      case 'https':
        endpoint += 'https';
        break;
      case 'https strict':
        endpoint += 'https';
        break;
      default:
        endpoint += 'http';
        break;
    }
    endpoint += '://' + ip + route;
    const options = {
      uri: endpoint,
      jar: true,
      json: true,
      strictSSL: method === 'https strict' ? true : false,
      auth,
      timeout: 5000 // TODO setup as node property
    }
    return await rpn(options) // GET request on endpoint
      .then(response => {
        return response;
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  }
  // *************************************************************
    initialize() {  //add actions to node
      this.createChild('add device', AddDevice);
    }
    loadChild(name, data) { //add serialized devices
        if (!this.children.has(name)) {
            if (data['$is'] === Device.profileName) {
                let node = this.createChild(name, Device, this);
                node.load(data);
                node.refresh();
            }
        }
    }
  // *************************************************************
}
class AddDevice extends ActionNode {
  initialize() {
    this.setConfig('$params', [
      {name: 'method', type: 'enum[http,https,https strict]'},
      {name: 'ip address', type: 'string'},
      {name: 'username', type: 'string'},
      {name: 'password', type: 'string', editor: 'password'}
    ]);
  }
  async onInvoke(params, parentNode) {
    const {'ip address': ipAddr, username, password} = params;
    // check params
    if (!ip.isV4Format(ipAddr)) return new DsError('invalidInput', {msg: 'must be valid ip'});
    if (!username) return new DsError('invalidInput', {msg: 'username cannot be blank'});
    if (!password) return new DsError('invalidInput', {msg: 'password cannot be blank'});
    return await this.getDevice(params, parentNode)
      .then(hostId => {
        let device = parentNode.createChild(hostId, Device, this);  // add new device
        device.load({
          $ip: ipAddr,
          $auth: Base64.encode(username + ':' + password)
        });
        return device;
      })
      .catch(code => {
        console.log(code);
        switch(code) {  //http code error handling
          case 401: return new DsError('invalidInput', {msg: 'invalid credentials'});
          case 404: return new DsError('invalidInput', {msg: 'failed to find eclypse device'});
          default: return new DsError('invalidInput', {msg: 'failed to add device'});
        }
      });
  } 
  async getDevice(params, parentNode) {
    const {method, 'ip address': ipAddr, username, password} = params;
    const auth = {
      user: username,
      pass: password,
      sendImmediately: true
    }
    return await parentNode.get(method, ipAddr, '/api/rest/v1/info/device', auth) // GET device properties endpoint
      .then(body => {
        return body.hostId;
      })
      .catch(error => {
        throw error.statusCode;
      });
  }
}
exports.Eclypse = Eclypse;