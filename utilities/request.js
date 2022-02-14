const http = require('http');
const config = require('../config');

module.exports = class Requester {

    static get(host, path, port = config.counterPort){
        return this._doRequest(host, path, 'GET', port);
    }

    static post(host, path, port = config.counterPort){
        return this._doRequest(host, path, 'POST', port);
    }

    static _doRequest(host, path, method, port) {
        const options = {
            host, path, method, port
        }

        return new Promise((resolve, reject) => {
            const request = http.request(options, response => {
                let result = '';
                response.on('data', chunk => {
                    result += chunk
                })
                response.on('end', () => {
                    resolve(result);
                })
            })
            request.on('error', err => {
                reject(err);
            })
            request.end();

        })
    }

}
