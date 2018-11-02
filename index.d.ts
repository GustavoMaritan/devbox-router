declare interface Controller {

    static post(action: Function);
    static post(uri: String, action: Function);
    static post(uri: String, prefix: boolean, action: Function);
    static post(uri: String, options: {
        prefix?: boolean,
        public?: boolean,
        noOption?: boolean
    }, action: Function);
    static post(options: {
        prefix?: boolean,
        public?: boolean,
        noOption?: boolean
    }, action: Function);

    static get(action: Function);
    static get(uri: String, action: Function);
    static get(uri: String, prefix: boolean, action: Function);
    static get(uri: String, options: {
        prefix?: boolean,
        public?: boolean,
        noOption?: boolean
    }, action: Function);
    static get(options: {
        prefix?: boolean,
        public?: boolean,
        noOption?: boolean
    }, action: Function);

    static put(action: Function);
    static put(uri: String, action: Function);
    static put(uri: String, prefix: boolean, action: Function);
    static put(uri: String, options: {
        prefix?: boolean,
        public?: boolean,
        noOption?: boolean
    }, action: Function);
    static put(options: {
        prefix?: boolean,
        public?: boolean,
        noOption?: boolean
    }, action: Function);

    static delete(action: Function);
    static delete(uri: String, action: Function);
    static delete(uri: String, prefix: boolean, action: Function);
    static delete(uri: String, options: {
        prefix?: boolean,
        public?: boolean,
        noOption?: boolean
    }, action: Function);
    static delete(options: {
        prefix?: boolean,
        public?: boolean,
        noOption?: boolean
    }, action: Function);
}

class Router {

    static init(app: express, options: {
        prefix?: string,
        folder?: 'src/core',
        filename?: 'controller.js',
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
     * require('devbox-router').controller('cliente/telefone');
     * require('devbox-router').controller(__filename);
     * require('devbox-router').controller(__filename, { opcoes todas rotas });
     */
    static controller(name: string, options: Object): Controller
}

export = Router
