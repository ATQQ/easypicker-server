import http from 'http'
// types
import { FWRequest, FWResponse, Middleware } from './types'

// router
import Router from './../router'

// 自带中间件
import { expandHttpRespPrototype, runMathRoute } from './middleware'
import { printRequest, wrapperRequest } from './middleware'

const PORT = 3000
const HOSTNAME = 'localhost'

// 拓展httpResponse的原型
expandHttpRespPrototype(http)

export default class FW extends Router{
    private _server: http.Server
    private _middleWares: Middleware[]
    private async _execMiddleware(req: FWRequest, res: FWResponse) {
        for (const middleware of this._middleWares) {
            await middleware(req, res)
        }
    }

    constructor() {
        super()
        // 初始化
        this._middleWares = []

        // 通过各种中间件包装req与res
        // 通过中间件对请求进行处理
        // 包装request
        this.use(wrapperRequest)
        // 打印请求信息
        this.use(printRequest)
        // 路由匹配
        this.use(runMathRoute.bind(this, this._routes))

        this._server = http.createServer(async (req: FWRequest, res: FWResponse) => {
            // default
            res.setHeader('Content-Type', 'application/json;charset=utf-8')
            this._execMiddleware(req, res)
        })
    }

    /**
     * todo: ddl 2021-1-12 考虑声明周期？
     * @param middleware 中间件函数
     */
    public use(middleware: Middleware): void {
        this._middleWares.push(middleware)
    }
    public listen(port = PORT, hostname = HOSTNAME, callback?: () => void): void {
        this._server.listen(port, hostname, callback)
    }
}