const path = require('path');
const find = require('devbox-recursive-find');
const Controller = require('./lib/router');

class Router {

    static init(app, options) {
        let base = {
            prefix: '',
            folder: './src/core',
            filename: 'controller.js',
            actionFilter: (action, options) => {
                return async (req, res) => {
                    await action();
                }
            }
        }
        options = Object.assign(base, options);

        Controller._setOptions(options);

        find.file(options.folder, options.filename)
            .forEach(x => require(path.resolve(x)));

        for (let i in Controller.routes)
            Controller.routes[i].forEach(x => {
                app[x.method](x.uri, options.actionFilter(x.action, x.options));
            });

        return Controller;
    }

    static controller(name) {
        Controller._set(name);
        return Controller;
    }
}

module.exports = Router;
