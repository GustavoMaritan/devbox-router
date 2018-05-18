declare interface Controller {

    static post(action: Function);
    static post(uri: String, action: Function);
    static post(uri: String, prefix: boolean, action: Function);
    static post(uri: String, options: {
        prefix?: boolean
    }, action: Function);
}

class Router {

    static init(app: express, options: {
        prefix?: string,
        folder?: 'src/core',
        fileName?: 'controller.js',
        actionFilter?: Function
    }): Controller

    /**
     * @description
     *  -
     *  - Cria padrão de rota para o controller
     *  - Cria objeto para registrar rotas
     * 
     * @param name 
     *  [controller_name] OR [__filename]
     * 
     * @example
     * 
     * require('devbox-router').controller('usuario');
     * require('devbox-router').controller(__filename);
     */
    static controller(name: string): Controller
}

export = Router
