import Router from '@/lib/router'

// db
import { selectUserByUsername, insertUser } from '@/db/userDb'

// util
import { rMobilePhone, rVerCode } from '@/utils/regExp'
import storage from '@/utils/storageUtil'
import { UserError, GlobalError } from '@/constants/errorMsg'

const router = new Router('user')

/**
 * 登录
 */
router.post('login', async (req, res) => {
    console.log(req.data)
    const { username } = req.data
    const user = await selectUserByUsername(username)
    res.success(user[0])
})

/**
 * 获取验证码
 */
router.get('getCode', async (req, res) => {
    console.log(req.data)
    res.success()
})

/**
 * 注册账号
 */
router.post('user', async (req, res) => {
    const { username, password, mobile, code } = req.data
    let isBindMobile = false
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
        isBindMobile = true
    }
    const data = await insertUser(username, password, isBindMobile, mobile)
    // 数据插入失败
    if (data.affectedRows !== 1) {
        return res.failWithError(GlobalError.unknown)
    }
    res.success()
})

export default router