const {BaseLocalNode, ActionNode} = require("dslink");

class Device extends BaseLocalNode {
    initialize() {
        this.createChild('Remove', Remove);
    }
}

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

exports.Device = Device;