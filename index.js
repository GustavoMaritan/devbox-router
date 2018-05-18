const path = require('path');
const find = require('devbox-recursive-find');
const Controller = require('./lib/router');

class Router {

    static init(app, options) {
        if (options.prefix) Controller._prefix(options.prefix);

        const files = find.file(options.folder || './src/core', options.fileName || 'controller.js');
        files.forEach(x => require(path.resolve(x)));

        for (let i in Controller.routes)
            Controller.routes[i].forEach(x => {
                app[x.method](x.uri, options.actionFilter
                    ? options.actionFilter(x.action, x.options)
                    : async (req, res) => { await x.action(req, res) }
                );
            });

        return Controller;
    }

    static controller(name) {
        Controller._set(name);
        return Controller;
    }
}

module.exports = Router;
