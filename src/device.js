const {BaseLocalNode, ActionNode, ValueNode} = require("dslink");
const rpn = require('request-promise-native');

class Device extends BaseLocalNode {
    constructor(path, provider) {
        super(path, provider);
        this._cookieJar = rpn.jar();
    }
    initialize() {
        this.createChild('Refresh', Refresh);
        this.createChild('Remove', Remove);
    }
    loadChild(name, data) {
        if (!this.children.has(name)) {
            if (data['$is'] === 'property') {
                let node = this.createChild(name, Property);
                node.load(data);
            }
        }
    }
    shouldSaveConfig(key) {
        return true;
    }
    setCookie() {
        this._cookieJar.setCookie(this.getConfig('cookie'), this.getUri('/'))
    }
    getUri(route) {
        return `http://${this.getConfig('ip')}` + String(route);
    }
}
Device.profileName = 'device';

class Refresh extends ActionNode {
    async onInvoke(params, parentNode) {
        let options = {
        uri: parentNode.getUri('/api/rest/v1/info/device'),
        jar: parentNode._cookieJar,
        json: true,
        resolveWithFullResponse: true,
        timeout: 5000
      };
      return await rpn(options)
        .then(response => {
            let {body} = response;
            // update device properties
            return device;
        })
        .catch(err => {
            console.log(err.message);
            return new DsError('invalidInput', {msg: err.message});
        });
    }
}

class Remove extends ActionNode {
    onInvoke(params, parentNode) {
        parentNode.provider.removeNode(parentNode.path);
    }
}

class Property extends ValueNode {
    constructor(path, provider) {
        super(path, provider, undefined, undefined, true);
    }
}
Property.profileName = 'property';

exports.Device = Device;
exports.Property = Property;