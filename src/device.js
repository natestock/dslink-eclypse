const {BaseLocalNode} = require("dslink");

class Device extends BaseLocalNode {
    constructor(path, provider) {
      super(path, provider);
    }
}

exports.Device = Device;