// types
import { Route } from '@/lib/server/types'

// router
import qiniu from './modules/qiniu'
import user from './modules/user'
import report from './modules/report'
import course from './modules/course'
import childContent from './modules/childContent'
import file from './modules/file'
import people from './modules/people'

const routers = [qiniu, user, report, course, childContent, file, people]

export default routers.reduce((pre: Route[], router) => {
    return pre.concat(router.getRoutes())
}, [])