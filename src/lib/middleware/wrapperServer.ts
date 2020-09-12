// types
import { SuperHttpRequest, SuperHttpResponse } from '@/lib/types'
import { ServerOptions } from 'http'

// other module
import qs from 'query-string'
import url from 'url'
import { CodeMsg } from '@/lib/enums'

/**
 * 回调模板
 */
class Result {
    private code: number
    private data: unknown
    private msg: string
    constructor(code: number, errMsg: string, data?: unknown) {
        this.code = code
        this.data = data
        this.msg = errMsg
    }
}

enum ContentType {
    formData = 'application/x-www-form-urlencoded',
    jsonData = 'application/json'
}
/**
 * 获取request请求携带的data数据 (用于非GET请求)
 * @param {HttpRequest} req 
 */
function getBodyContent(req: SuperHttpRequest) {
    return new Promise((resolve, reject) => {
        let buffer = Buffer.alloc(0)

        req.on('data', chunk => {
            buffer = Buffer.concat([buffer, chunk])
        })

        req.on('end', () => {
            const contentType = req.headers['content-type']
            let data = {}
            try {
                if (contentType.includes(ContentType.formData)) {
                    data = qs.parse(buffer.toString())
                }

                if (contentType.includes(ContentType.jsonData)) {
                    data = JSON.parse(buffer.toString())
                }

            } catch (error) {
                console.log(buffer.toString())
                console.error(error)
                data = {}
                reject(error)
            } finally {
                resolve(data)
            }
        })
    })
}

export default async function wrapperServer(req: SuperHttpRequest, res: SuperHttpResponse): Promise<void> {
    res.setHeader('Content-Type', 'application/json;charset=utf-8')
    const { query } = url.parse(req.url)
    req.data = req.method === 'GET' ? qs.parse(query) : await getBodyContent(req)
}

export function expandHttpServerMethod(http: ServerOptions): void {
    const res: SuperHttpResponse = http.ServerResponse.prototype
    res.notFound = function () {
        this.statusCode = 404
        this.setHeader('Content-Type', 'text/html;charset=utf-8')
        this.end('<h1>url not found</h1>')
    }

    res.json = function (data) {
        this.end(JSON.stringify(data))
    }

    res.success = function (data?) {
        this.json(new Result(0, 'ok', data))
    }

    res.fail = function (code, msg, data) {
        this.json(new Result(code, msg, data))
    }

    res.failWithError = function (err) {
        this.fail(err.code, err.msg)
    }
}

export function globalResponseError(errCode: CodeMsg, errData?: unknown): void {
    const res: SuperHttpResponse = global['res']
    res.fail(errCode.code, errCode.msg, errData)
}