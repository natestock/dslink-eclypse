const {DSLink, RootNode, BaseLocalNode, ValueNode, Permission} = require("dslink");

class Device extends BaseLocalNode {
  constructor(path, provider) {
    super(path, provider);
    
  }
  authenticate() {

  }
}

function main() {
  let rootNode = new RootNode();
  rootNode.createChild('value', MyValueNode);
  let link = new DSLink('mydslink', {rootNode});
  link.connect();
}

main();
