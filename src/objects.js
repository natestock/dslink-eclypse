const {BaseLocalNode, ActionNode, ValueNode} = require("dslink");
const {get} = require('./request');

class Objects extends BaseLocalNode {
    update() {
        
    }
}

Object.profileName = 'objects';

exports.Objects = Objects;