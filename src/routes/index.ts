// types
import { Route } from '@/lib/server/types'

// router
import qiniu from './modules/qiniu'

const routers = [qiniu]

export default routers.reduce((pre: Route[], router) => {
    return pre.concat(router.getRoutes())
}, [])