const path = require('path');
const find = require('devbox-recursive-find');
const Router = require('./lib/router');

class Router {

    static init(app, options) {
        if (options.prefix) Router._prefix(options.prefix);

        const files = find.file(options.folder || './src/core', options.fileName || 'controller.js');
        files.forEach(x => require(path.resolve(x)));

        for (let i in Router.routes)
            Router.routes[i].forEach(x => {
                app[x.method](x.uri, options.actionFilter
                    ? options.actionFilter(x.action, x.options)
                    : async (req, res) => { await x.action(req, res) }
                );
            });

        return Router;
    }

    static controller(name) {
        Router._set(name);
        return Router;
    }
}

module.exports = Router;
