// types
import { Route } from '@/lib/server/types'

// router
import qiniu from './modules/qiniu'
import user from './modules/user'
import report from './modules/report'

const routers = [qiniu, user, report]

export default routers.reduce((pre: Route[], router) => {
    return pre.concat(router.getRoutes())
}, [])