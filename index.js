const path = require('path');
const find = require('devbox-recursive-find');
const Controller = require('./lib/router');
const colors = require(`colors`);


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

        const _controllerErro = [];

        find.file(path.join(process.cwd().split('node_modules')[0], options.folder), options.filename)
            .forEach(x => {
                try {
                    require(path.resolve(x))
                } catch (error) {
                    let _controllerName = x.split('\\');
                    _controllerErro.push({ ctrl: _controllerName[_controllerName.length - 2], error: error })
                }
            });

        if (_controllerErro.length) {
            console.log(colors.red('___________________________________________________________\n'));
            console.log(colors.red('> Erros ao gerar controllers'));
            _controllerErro.forEach(x => {
                console.log(colors.gray(`\nController: ${colors.green(x.ctrl)}`));
                console.error(x.error);
            });
            console.log(colors.red('___________________________________________________________\n'));
        }

        const print_route = process.env.PRINT_ROUTES;
        const methodColor = (method) => {
            switch (method.toLowerCase()) {
                case 'get': return 'green';
                case 'post': return 'yellow';
                case 'put': return 'blue';
                case 'delete': return 'magenta';
            }
        }

        if (print_route) console.log(colors.gray('__________________________________________________________________'));
        if (print_route) console.log(colors.magenta('> Rotas'));

        for (let i in Controller.routes) {
            if (print_route) console.log(`\t Controller: ${colors.green(i)}`);

            Controller.routes[i].forEach(x => {

                if (print_route) {
                    const _parameters = x.uri.match(/\:\D\w+/g);
                    let _route = x.uri;
                    if (!!_parameters)
                        _parameters.forEach(y => { _route = _route.replace(y, colors.white(y)); });
                    _route = colors.gray(_route);
                    console.log('\t', colors[methodColor(x.method)](_padRight(x.method)), ' - ', _route);
                }

                if (x.options.middlewares && x.options.middlewares.length) {
                    app[x.method](x.uri, ...x.options.middlewares, options.actionFilter(x.action, x.options));
                } else {
                    app[x.method](x.uri, options.actionFilter(x.action, x.options));
                }
            });

            if (print_route && Controller._errorRoutes[i]) {
                console.log(`\t${colors.yellow(`* Rotas não registradas(${colors.red('CONFLITO')})`)}`);
                Controller._errorRoutes[i].rotas.forEach(y => {
                    console.log('\t',
                        `${colors[methodColor(y.item.method)](_padRight(y.item.method))}  -  ${colors.red(y.item.url)} | ` +
                        colors.grey(`Controller: ${y.conflito.ctrl} | ${y.conflito.method} - ${y.conflito.url}`)
                    );
                });
            }
            if (print_route) console.log('');
        }
        if (print_route) console.log(colors.gray('__________________________________________________________________'));
        if (!print_route && !!Controller._errorRoutes) {
            console.log(colors.red('> Erro ao registrar rotas'));
            Object.keys(Controller._errorRoutes).forEach(x => {
                console.log(`\t Controller: ${colors.green(x)}`);
                Controller._errorRoutes[x].rotas.forEach(y => {
                    const message =
                        colors.red('\t\t> Rota') +
                        colors.gray(`\t\t\t| Ctrl: ${y.item.ctrl}, Url: ${y.item.url}, Method: ${y.item.method} \n`) +
                        colors.magenta('\t\t> Conflito com') +
                        colors.gray(`\t\t| Ctrl: ${y.conflito.ctrl}, Url: ${y.conflito.url}, Method: ${y.conflito.method} \n`) +
                        colors.yellow('\t\t----------------------------------------------------------------------------');
                    console.log(message);
                });
                console.log(``);
            });
        }
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
