import Router from '@/lib/Router'
import { createDownloadUrl } from '@/utils/qiniuUtil'

const router = new Router('file/qiniu')

router.get('/download', (req, res) => {
    // todo：鉴权逻辑
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
})

// 测试的demo
router.get('/a/b/:id', (req, res) => {
    console.log(req.pathValue)
    console.log(req.query)
    console.log(req.data)
    res.success()
})

export default router
