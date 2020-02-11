const {BaseLocalNode, ActionNode, ValueNode} = require("dslink");

class Device extends BaseLocalNode {
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
}
Device.profileName = 'device';

class Refresh extends ActionNode {
    async onInvoke(params, parentNode) {
        let options = {
        uri: `http://${this.getConfig('ip')}/api/rest/v1/info/device`,
        headers: {
          'Set-Cookie': this.getConfig('cookie')
        },
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
            console.log(err);
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