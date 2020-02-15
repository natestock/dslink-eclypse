const {BaseLocalNode, ActionNode, ValueNode} = require("dslink");
const {BaseNode, Remove} = require("../base-nodes");
const Base64 = require("js-base64");
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
                throw new Error(error);
            });
    }
    initialize() {
        this.createChild('remove', Remove);
        this.createChild('status', ValueNode);
    }
}

exports.Device = Device;