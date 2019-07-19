const path = require('path');
const find = require('devbox-recursive-find');
const Controller = require('./lib/router');

class Router {

    static init(app, options) {
        let base = {
            prefix: '',
            folder: './src/core',
            filename: 'controller.js',
            middlewares: null,
            actionFilter: (action, options) => {
                return async (req, res, next) => {
                    try {
                        await action(req, res, next);
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

        find.file(path.join(__dirname.split('node_modules')[0], options.folder), options.filename)
            .forEach(x => {
                try {
                    require(path.resolve(x))
                } catch (error) {
                    if (process.env.SHOW_FULL_ERROR) {
                        console.error(x, '\n', error)
                    } else {
                        console.error(x)
                    }
                }
            });

        if (process.env.PRINT_ROUTES) console.log('__________________________________________');
        if (process.env.PRINT_ROUTES) console.log('Rotas');
        for (let i in Controller.routes) {
            if (process.env.PRINT_ROUTES) console.log('    ', i);
            Controller.routes[i].forEach(x => {
                if (process.env.PRINT_ROUTES) console.log('        ', _padRight(x.method), ' - ', x.uri);
                
                if (x.options.middlewares && x.options.middlewares.length) {
                    app[x.method](x.uri, ...x.options.middlewares, options.actionFilter(x.action, x.options));
                } else {
                    app[x.method](x.uri, options.actionFilter(x.action, x.options));
                }
            });
            if (process.env.PRINT_ROUTES) console.log('    ', '_________________________________________');
        }
        if (process.env.PRINT_ROUTES) console.log('__________________________________________');

        return Controller;
    }

    static controller(name, options) {
        Controller._set(name, options);
        return Controller;
    }
}

function _padRight(value) {
    return Array((6 + 1) - value.length).join(' ') + value;
}

module.exports = Router;
