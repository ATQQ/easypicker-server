import { Middleware } from '@/lib/server/types'

const interceptor: Middleware = (req) => {
    if (req.routeOptions) {
        console.log(req.routeOptions)
    }
}
export default interceptor