const {BaseLocalNode, ActionNode, ValueNode} = require("dslink");
const {get} = require('./request');
const {Objects} = require('./objects');

class Device extends BaseLocalNode {
    initialize() {
        this.createChild('Refresh', Refresh);
        this.createChild('Remove', Remove);
        this.createChild('STATUS', Property);
        this.createChild('objects', Objects);
    }
    loadChild(name, data) {
        if (!this.children.has(name)) {
            if (data['$is'] === 'property') {
                let node = this.createChild(name, Property);
                node.load(data);
            } else if (data['$is'] === 'objects') {
                let node = this.createChild(name, Property);
                node.load(data);
            }
        }
    }
    shouldSaveConfig(key) { //save all config values '$'
        return true;
    }

    //custom functions

    async connect() {
        const status = this.children.get('STATUS');
        status.setValue('Connecting');

        return await get(this.getConfig('$ip'), '/api/rest/v1', true, {user:this.getConfig('$user'), pass:this.getConfig('$pass'), sendImmediately: false})
            .then(result => {
                status.setValue('Connected');
                return true;
            }).catch(error => {
                status.setValue('Failed to Connect');
                console.log(error);
                return false;
            });
    }

    update() {
        this.connect().then(() => {
            this.deviceProperties();
            this.children.get(objects).update();
        }).catch(error => console.log(error));
    }

    deviceProperties() {
        get(this.getConfig('$ip'), '/api/rest/v1/info/device', true)
            .then(body => {
                for (const property in body) {
                    if (property === 'hostName') {
                        this.setConfig('name', body[property]);
                    }
                    let node = this.children.has(property) ? this.children.get(property) : this.createChild(property, Property);
                    node.setValue(body[property]);
                }
            }).catch(error => console.log(error));
    }
}
Device.profileName = 'device';  //set device '$is' to 'device'

class Refresh extends ActionNode {
    onInvoke(params, parentNode) {
        parentNode.update();
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