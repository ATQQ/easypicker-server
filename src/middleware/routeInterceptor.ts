import { User, UserPower, UserStatus } from '@/db/modal'
import { Middleware } from '@/lib/server/types'
import tokenUtil from '@/utils/tokenUtil'
import { GlobalError } from '@/constants/errorMsg'

function judgePower(power: UserPower, token: string) {
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

const interceptor: Middleware = (req, res) => {
    if (!req.routeOptions) {
        return
    }
    const { power } = req.routeOptions
    // 鉴权
    if (!judgePower(power, req.headers['token'] as string)) {
        res.failWithError(GlobalError.powerError)
        return
    }
}
export default interceptor