const {BaseLocalNode, ValueNode} = require("dslink");

class RestNode extends BaseLocalNode {

    async loadNode(parentNode) {

        return await parentNode.get(this.getConfig('$endpoint'))    //call parent get endpoint function

            .then(response => {

                let { body } = response;    //get response body

                return await this.loadChildren(parentNode, body); //load children

            }).catch(error => {

                throw new Error(error); //throw error

            });

    }

    async loadChildren(parentNode, body) {

        let nodes = []; //array to hold children promises

        for (key in body) { //for each key either add new node or new value

            let value = body[key];

            if (typeof value === 'obj') {

                if (value.href && value.name) {

                    let node = this.createChild(value.name, RestNode);

                    node.load({ '$endpoint':ip+value.href });

                    nodes.push(node.loadNode(parentNode));  //push child loadNode to promise array

                }

            } else {

                let node = this.createChild(key, ValueNode);    //create value node

                node.load({ '?value':value });

            }

        }

        return await Promise.all(nodes);    //await all child promises to resolve/reject

    }
}