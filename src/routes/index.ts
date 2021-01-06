// types
import Router from '@/lib/router'
import { Route } from '@/lib/server/types'

// router
import qiniu from './modules/qiniu'

const routers: Router[] = [qiniu]

export default routers.reduce((pre: Route[], router) => {
    return pre.concat(router.getRoutes())
}, [])