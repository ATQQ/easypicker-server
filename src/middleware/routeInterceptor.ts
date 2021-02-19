import { User, UserPower, UserStatus } from '@/db/modal'
import { FWRequest, Middleware } from '@/lib/server/types'
import tokenUtil from '@/utils/tokenUtil'
import { GlobalError } from '@/constants/errorMsg'
import nodeUrl from 'url'
import { selectCourse } from '@/db/courseDb'
import { CourseType } from '@/constants/dbModalParam'
import { selectPeople } from '@/db/peopleDb'
import { selectReportById } from '@/db/reportDb'

function judgeLoginPower(power: UserPower, token: string) {
    const userInfo: User = tokenUtil.getUserInfo(token)
    // 不需要权限
    if (power !== UserPower.admin && power !== UserPower.superAdmin) {
        return true
    }

    // 没有登录
    if (!userInfo) {
        return false
    }
    if (userInfo.status === UserStatus.freeze) {
        return false
    }

    // 超级管理员直接放行
    if (power === UserPower.superAdmin && userInfo.power === UserPower.superAdmin) {
        return true
    }

    // 普通管理员
    if (power === UserPower.admin && userInfo.power === UserPower.admin) {
        return true
    }
    return false
}

async function judgeSpecialPathPower(req: FWRequest) {
    const { method } = req
    const { pathname } = nodeUrl.parse(req.url)
    const userInfo: User = tokenUtil.getUserInfo(req.headers['token'] as string)

    // TODO: 优化冗余代码

    if (method === 'PUT' && pathname === '/childContent/childContent') {
        const { taskid } = req.data
        const course = (await selectCourse({
            id: taskid
        }))[0]
        if (!userInfo?.username || !course || course?.type === CourseType.PARENT || course?.username !== userInfo?.username) {
            return false
        }
    }
    if (method === 'DELETE' && pathname === '/course/del') {
        const { id } = req.data
        const course = (await selectCourse({
            id
        }))[0]
        if (!userInfo?.username || !course || course?.username !== userInfo?.username) {
            return false
        }
    }
    if (method === 'DELETE' && pathname === '/people/people') {
        const { id } = req.data
        const people = (await selectPeople({
            id
        }))[0]

        if (!userInfo?.username || !people || people?.admin_username !== userInfo?.username) {
            return false
        }
    }
    if (method === 'GET' && pathname === '/file/qiniu/download') {
        const { username, tasks } = req.query || {}

        // TODO:斟酌一下特殊情况
        if (!tasks?.includes('_Template') && (!userInfo?.username || username !== userInfo?.username)) {
            return false
        }
    }
    if (method === 'DELETE' && pathname === '/report/report') {
        const { id } = req.data
        const report = (await selectReportById(id))[0]

        if (!userInfo?.username || !report || report?.username !== userInfo?.username) {
            return false
        }
    }
    return true
}

function judgeUserSelf(req: FWRequest) {
    if (!req?.route?.options?.userSelf) {
        return true
    }
    const { method } = req
    const userInfo: User = tokenUtil.getUserInfo(req.headers['token'] as string)

    if (method === 'GET' && userInfo?.username && req?.query?.username === userInfo?.username) {
        return true
    }
    if (['PUT', 'DELETE', 'POST'].includes(method) && userInfo?.username && req?.data?.username === userInfo.username) {
        return true
    }
    return false
}
const interceptor: Middleware = async (req, res) => {
    const { options } = req.route
    if (!options) {
        return
    }
    const { power } = options
    // 接口登录鉴权
    if (!judgeLoginPower(power, req.headers['token'] as string)) {
        res.failWithError(GlobalError.powerError)
        return
    }

    // 特殊路由的特殊判断(最后)
    if (!(await judgeSpecialPathPower(req))) {
        res.failWithError(GlobalError.powerError)
        return
    }

    // 不允许跨用户操作
    if (!judgeUserSelf(req)) {
        res.failWithError(GlobalError.powerError)
        return
    }

}
export default interceptor