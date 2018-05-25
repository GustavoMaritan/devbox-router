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
                return async (req, res, next) => {
                    try {
                        await action();
                    } catch (error) {
                        console.log('Erro: ', ex.message);
                        res.status(500).json({ message: ex.message });
                    }
                    next();
                }
            }
        }
        options = Object.assign(base, options);

        Controller._setOptions(options);

        find.file(options.folder, options.filename)
            .forEach(x => require(path.resolve(x)));

        if (process.env.PRINT_ROUTES) console.log('__________________________________________');
        if (process.env.PRINT_ROUTES) console.log('Rotas');
        for (let i in Controller.routes) {
            if (process.env.PRINT_ROUTES) console.log('    ', i);
            Controller.routes[i].forEach(x => {
                if (process.env.PRINT_ROUTES) console.log('        ', _padRight(x.method), ' - ', x.uri);
                app[x.method](x.uri, options.actionFilter(x.action, x.options));
            });
        }
        if (process.env.PRINT_ROUTES) console.log('__________________________________________');

        return Controller;
    }

    static controller(name) {
        Controller._set(name);
        return Controller;
    }
}

function _padRight(value) {
    return Array((6 + 1) - value.length).join(' ') + value;
}

module.exports = Router;
