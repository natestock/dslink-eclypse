const rpn = require('request-promise-native');

async function get(ip, route, https) {
    let endpoint = (https ? 'https://' : 'http://') + ip + route;   //endpoint

    let options = {
        uri: endpoint,
        jar: true,
        json: true,
        resolveWithFullResponse: true,
        timeout: 5000
      };

    return await rpn(options)
        .then(response => {
            let {body} = response;
            return body;
        })
        .catch(err => {
            return new Error(err);
        });
}

exports.get = get;