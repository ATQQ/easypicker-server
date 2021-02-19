import { UserPower } from '@/db/modal'
import Router from '@/lib/Router'
import { createDownloadUrl, getUploadToken, judgeFileIsExist, makeZip, checkFopTaskStatus } from '@/utils/qiniuUtil'

const router = new Router('file/qiniu')

router.get('/download', (req, res) => {
    const { query } = req
    const { course, filename, tasks, username } = query || {}
    if (course && filename && tasks && username) {
        const key = `${username}/${course}/${tasks}/${filename}`
        // 生成下载链接
        const url = createDownloadUrl(key)
        res.success({
            url
        })
        return
    }

    res.fail(404, 'error params')
}, {})


router.get('token', async (req, res) => {
    res.success({
        data: getUploadToken()
    })
})

router.get('exist', (req, res) => {
    const { key } = req.query
    judgeFileIsExist(key).then(isExist => {
        res.success({ isExist })
    })
})

router.post('compress', (req, res) => {
    const { username, course, tasks } = req.data
    const key = `${username}/${course}/${tasks}/`
    makeZip(key, `${course}-${tasks}`).then(url => {
        res.success({ url })
    })
}, { power: UserPower.admin, userSelf: true })

router.post('compress/status', (req, res) => {
    const { url } = req.data
    checkFopTaskStatus(url).then(data => {
        res.success(data)
    })
}, { power: UserPower.admin })
// 测试的demo
router.get('/a/b/:id', (req, res) => {
    console.log(req.pathValue)
    console.log(req.query)
    console.log(req.data)
    res.success()
})

export default router
