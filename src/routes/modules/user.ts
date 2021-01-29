import Router from '@/lib/router'

// db
import { selectUserByUsername, insertUser } from '@/db/userDb'

// util
import { rMobilePhone, rVerCode } from '@/utils/regExp'
import storage from '@/utils/storageUtil'
import { UserError, GlobalError } from '@/constants/errorMsg'
import tokenUtil from '@/utils/tokenUtil'

const router = new Router('user')

/**
 * 登录
 */
router.post('login', async (req, res) => {
    const { username, password } = req.data
    const [user] = await selectUserByUsername(username)
    // 用户不存在
    if (!user) {
        return res.fail(20010, '用户不存在')
    }
    // 密码错误
    // TODO: 对比加密后的密码
    if (password !== user.password) {
        return res.fail(20011, '密码错误')
    }
    const { power, status } = user
    // TODO: 生成token的逻辑修改
    // TODO: 存放在redis里，确保node服务是无状态的
    const token = 'abc' || tokenUtil.createToken(user)

    res.success({
        token,
        power,
        status
    })
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