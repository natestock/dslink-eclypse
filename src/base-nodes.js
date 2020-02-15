const {BaseLocalNode, ActionNode} = require("dslink");
class BaseNode extends BaseLocalNode {
    constructor(path, provider, parent) {
        super(path, provider);
        this.parent = parent;
    }
    shouldSaveConfig(key) { //save all config values '$'
        return true;
    }
    loadChild(name, data) { //add serialized devices
        if (!this.children.has(name)) {
            if (data['$is'] === 'node') {
                let node = this.createChild(name, BaseNode, this);
                node.load(data);
            }
        }
    }
}
class Remove extends ActionNode {
    onInvoke(params, parentNode) {
        parentNode.provider.removeNode(parentNode.path);
    }
}

exports.BaseNode = BaseNode;
exports.Remove = Remove;