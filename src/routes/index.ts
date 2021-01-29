// types
import { Route } from '@/lib/server/types'

// router
import qiniu from './modules/qiniu'
import user from './modules/user'

const routers = [qiniu,user]

export default routers.reduce((pre: Route[], router) => {
    return pre.concat(router.getRoutes())
}, [])