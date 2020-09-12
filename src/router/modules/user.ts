import Router from '../../lib/Router'

// db
import { selectUserByUsername, insertUser } from './../../db/userDb'

// util
import { rMobilePhone, rVerCode } from './../../utils/regExp'
import storage from './../../utils/storageUtil'
import { UserError, GlobalError } from '../../lib/enums/errorMsg'

const userRouter = new Router('user')

interface LoginData {
    username: string
    password: string
}

userRouter.post<LoginData>('login', async (req, res) => {
    console.log(req.data)
    const { username, password } = req.data
    const user = await selectUserByUsername(username)
    res.success(user[0])
})

userRouter.get('getCode', async (req, res) => {
    console.log(req.data)
    res.success()
})

interface RegisterData {
    username: string,
    password: string,
    mobile?: string,
    code?: string
}

/**
 * 注册账号
 */
userRouter.post<RegisterData>('user', async (req, res) => {
    const { username, password, mobile, code } = req.data
    // 判断是否需要绑定手机号
    if (mobile) {
        // 手机号格式不正确
        if (!rMobilePhone.test(mobile)) {
            return res.failWithError(UserError.mobile.fault)
        }
        const codeValue = storage.getItem(mobile)
        // 验证码不正确
        if (!codeValue || !rVerCode.test(codeValue.value) || codeValue.value !== code) {
            return res.failWithError(UserError.code.fault)
        }

        const data = await insertUser(username, password, true, mobile)
        // 数据插入失败
        if (data.affectedRows !== 1) {
            return res.failWithError(GlobalError.unknown)
        }
        return res.success()
    }
    // TODO：待优化--有重复代码
    const data = await insertUser(username, password)
    // 数据插入失败
    if (data.affectedRows !== 1) {
        return res.failWithError(GlobalError.unknown)
    }
    res.success()
})

export default userRouter