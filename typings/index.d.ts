import { IncomingMessage, ServerResponse } from 'http'

interface Params {
    [key: string]: string
}

interface CodeMsg {
    code: number
    msg: string
}

interface SuperHttpRequest<T1 = unknown, T2 = Params> extends IncomingMessage {
    data?: T1
    params?: T2
}

type reqJson = (data: unknown) => void
type reqNotFound = () => void
type reqSuccess = (data?: unknown) => void
type reqFail = (code: number, msg: string, data?: unknown) => void
type failWithError = (err: CodeMsg) => void

interface SuperHttpResponse extends ServerResponse {
    json?: reqJson
    notFound?: reqNotFound
    success?: reqSuccess
    fail?: reqFail
    failWithError?: failWithError
}

type callback<T1 = unknown, T2 = unknown> = (req: SuperHttpRequest<T1, T2>, res: SuperHttpResponse) => void

interface Route {
    method: string
    path: string
    callback: callback
}