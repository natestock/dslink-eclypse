const rpn = require('request-promise-native');

async function get(ip, route, https, auth) {
    let endpoint = (https ? 'https://' : 'http://') + ip + route;   //endpoint

    let options = {
        uri: endpoint,
        jar: true,
        json: true,
        strictSSL: false,
        resolveWithFullResponse: true,
        timeout: 5000
      };

    if (auth) {
        options.auth = auth;
    }

    return await rpn(options)
        .then(response => {
            let {body} = response;
            return body;
        })
        .catch(err => {
            if(err.statusCode) {
                throw new Error(err.statusCode);
            } else {
                throw new Error(err);
            }
        });
}

exports.get = get;