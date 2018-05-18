const path = require('path');

class Controller {

    static post(...params) {
        this._add(this._prepare('post', params));
    }

    static get(...params) {
        this._add(this._prepare('get', params));
    }

    static put(...params) {
        this._add(this._prepare('put', params));
    }

    static delete(...params) {
        this._add(this._prepare('delete', params));
    }

    static _prefix(value) {
        this._prefix = value;
        this._object = value.split('/').join('_');
    }

    static _set(controller) {
        this._controller = /\.js$/.test(controller) ? path.basename(path.dirname(controller)) : controller;
    }

    static _prepare(method, params) {
        if (!this._controller)
            throw { message: 'Missing controller in route' };

        let route = { action: null, uri: null, method: method, options: {} };

        params.forEach(element => {
            switch (typeof element) {
                case 'function': route.action = element; break;
                case 'string': route.uri = element; break;
                case 'boolean': route.options.prefix = element; break;
                case 'object': route.options = element; break;
            }
        });

        route.uri = typeof route.options.prefix === 'undefined' || route.options.prefix
            ? this._normalize(`/${this._prefix}/${this._controller}${route.uri ? '/' + route.uri : ''}`)
            : this._normalize(this._prefix + (route.uri ? '/' + route.uri : ''));

        return route;
    }

    static _add(rota) {
        if (!this.routes)
            this.routes = {};

        if (!this.routes[this._controller])
            this.routes[this._controller] = [];

        this.routes[this._controller].push(rota);
    }

    static _normalize(rota) {
        if (!rota)
            return '/';

        if (rota[0] !== '/')
            rota = '/' + rota;

        rota = rota.replace(/\/\//g, '/');
        if (rota[rota.length - 1] === '/')
            rota = rota.substr(0, rota.length - 1);

        return rota;
    }
}

module.exports = Controller;
