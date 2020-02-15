const {ActionNode, ValueNode} = require("dslink");
const {BaseNode, Remove} = require("../base-nodes");
const {Base64} = require("js-base64");
// root class for Eclypse device
// stores IP, authentication credentials
class Device extends BaseNode {
    async get(route) {
        let credentials = Base64.decode(this.getConfig('$auth')).split(':');    // decode base64 token into [user, pass]
        const auth = {
            user: credentials[0],
            pass: credentials[1],
            sendImmediately: false
        };
        return await this.parent.get(this.getConfig('method'), this.getConfig('ip'), route, auth)   // GET request on endpoint
            .then(body => {
                return body;
            })
            .catch(error => {
                throw error;
            });
    }
    initialize() {
        this.createChild('refresh', Remove);
        this.createChild('remove', Remove);
        this.createChild('STATUS', ValueNode);
    }
    refresh() {
        this.children.get('STATUS').setValue('Connecting');
        this.get('/api/rest/v1/info/device')
            .then(() => {
                this.children.get('STATUS').setValue('Connecting');
            })
            .catch(() => {
                this.children.get('STATUS').setValue('Failed to Connect');
            });
    }
}

class Refresh extends ActionNode {
    onInvoke(params, parentNode) {
        parentNode.refresh();
    }
}

Device.profileName = 'device';

exports.Device = Device;