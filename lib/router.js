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

    static _set(controller, options) {
        controller = controller.replace(/\\/g, '/');
        let filename = controller.split(this._folderBase.replace(/\./g, ''));
        filename = filename.length > 1 ? filename[1] : filename[0];
        filename = /\.js$/.test(filename) ? path.dirname(filename) : filename;
        this._controller = filename.replace(/\\/g, '/');
        this._object = this._controller.split('/').filter(x => x).join('_');
        this._options = options;
    }

    static _prepare(method, params) {
        if (!this._controller)
            throw { message: 'Missing controller in route' };

        let route = {
            action: null,
            uri: null,
            method: method,
            options: this._options || {}
        };

        params.forEach(element => {
            switch (typeof element) {
                case 'function': route.action = element; break;
                case 'string': route.uri = element; break;
                case 'boolean': route.options.prefix = element; break;
                case 'object': route.options = { ...route.options, ...element }; break;
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

        if (!this.routes[this._object])
            this.routes[this._object] = [];

        //this._urlExists(rota, this._object);
        this.routes[this._object].push(rota);
    }

    static _normalize(rota) {
        if (!rota) return '/';
        if (rota[0] !== '/') rota = '/' + rota;

        if (rota[rota.length - 1] === '/')
            rota = rota.substr(0, rota.length - 1);

        rota = rota.replace(/\/{2,}/g, '/');
        return rota;
    }

    static _setOptions(options) {
        this._prefix = options.prefix;
        this._folderBase = options.folder;
        this._findFilename = options.filename;
    }

    static _urlExists(rota, ctrl) {
        let newUrl = rota.uri.replace(/\:\D\w+/g, '(.+)');
        let regex = new RegExp(newUrl);

        for (let i in this.routes) {
            if (this.routes[i].some(x => x.method == rota.method && regex.test(x.uri)))
                throw {
                    message: `♦ Rota ja registrada, verifique. \n` +
                        `| Ctrl: ${i}, Rota: ${rota.uri}, Method: ${rota.method} \n` +
                        `| Ctrl: ${ctrl}, Rota: ${rota.uri}, Method: ${rota.method}`
                };
        }
    }
}

module.exports = Controller;
