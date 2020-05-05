const path = require('path');
const colors = require(`colors`);

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

        return this._routeIsValid(route) ? route : null;
    }

    static _routeIsValid(route) {
        this._validRoutes = this._validRoutes || [];
        this._errorRoutes = this._errorRoutes || [];
        let $route = this._validRoutes.find(x =>
            !!x && x.uri.replace(/\:\D\w+/g, 'xxx') == route.uri.replace(/\:\D\w+/g, 'xxx') &&
            x.method == route.method
        );

        if (!$route) {
            this._validRoutes.push({
                controller: this._controller,
                uri: route.uri,
                method: route.method
            });
            return true;
        }

        const message =
            colors.red('\t> Rota') +
            colors.gray(`\t\t| Ctrl: ${this._controller}, Url: ${route.uri}, Method: ${route.method} \n`) +
            colors.magenta('\t> Conflito com') +
            colors.gray(`\t| Ctrl: ${$route.controller}, Url: ${$route.uri}, Method: ${$route.method} \n`) +
            colors.yellow('\t----------------------------------------------------------------------------');

        this._errorRoutes.push(message);
        if (this._errorRoutes.length == 1)
            console.log(colors.red('> Erro ao registrar rotas'));
        console.log(message);
        return false;
    }

    static _add(rota) {
        if (!rota) return;
        if (!this.routes)
            this.routes = {};

        if (!this.routes[this._object])
            this.routes[this._object] = [];

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
}

module.exports = Controller;
