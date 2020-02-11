const {BaseLocalNode} = require("dslink");

class Device extends BaseLocalNode {
    constructor(path, provider, data) {
      super(path, provider);
    }
}

exports.Device = Device;