import { SuperHttpRequest } from 'typings'
import nodeUrl from 'url'

/**
 * 打印访问日志ß
 * @param req ß
 */
export default function (req: SuperHttpRequest): void {
    const { method, url } = req
    const urlInfo = nodeUrl.parse(url)
    console.log(`${method} ${urlInfo.pathname}`)
}