import { callback, Route } from 'typings'
import nodePath from 'path'

class Router {
    private prefix: string
    private routes: Route[]
    constructor(prefix = '') {
        this.prefix = prefix
        this.routes = []
    }

    private register(method: string, path: string, callback: callback) {
        this.routes.push({
            method,
            path,
            callback
        })
    }

    private controller(method) {
        return <Data = unknown, Params = unknown>(path: string, callback: callback<Data, Params>) => {
            this.register(method, nodePath.join(this.prefix, path), callback)
        }
    }

    public get = this.controller('get')
    public post = this.controller('post')
    public put = this.controller('put')
    public del = this.controller('del')

    public getRoute(): Route[] {
        return this.routes
    }

}

export default Router
