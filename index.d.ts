import { Application } from "express";

declare interface Controller {
    static prefix(flags: string)
    static prefix(flags: string, description?: string)
    static prefix(flags: string, description?: string, mussak?: object)

    /**
     * 
     * @param params tesatfsdjhkjd
     */
    private static post(...params)
}

class Router {

    static init(app: Application, options: {
        prefix?: String,
        folder?: String,
        fileName?: String = 'controller.js',
        actionFilter?: Function
    }): Controller

    static controller(name: string): Controller
}

export = Router
