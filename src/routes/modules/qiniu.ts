import { UserPower } from '@/db/modal'
import Router from '@/lib/Router'
import { selectReport } from '@/db/reportDb'
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

router.post('compress', async (req, res) => {
    const { username, course, tasks } = req.data
    const key = `${username}/${course}/${tasks}/`
    const reports = await selectReport({
        username,
        course,
        tasks
    })
    const keys = reports.map(v => key + v.filename)
    // 增加时间戳后缀避免cdn缓存（暂时的bug是下载的内容一直是第一次压缩的）
    makeZip(key, `${course}-${tasks}-${Date.now()}`, keys).then(url => {
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
