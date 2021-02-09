import Router from '@/lib/Router'
import { getFileCount, judgeFileIsExist } from '@/utils/qiniuUtil'

const router = new Router('file')

router.get('check', async (req, res) => {
    const { username, course, tasks, filename } = req.query
    const key = `${username}/${course}/${tasks}/${filename}`
    let where = null
    const isExistOss = await judgeFileIsExist(key)
    // 旧: 如果在服务器上
    // if(){
    // where = 'server'
    // }
    if (isExistOss) {
        where = 'oss'
    }
    res.success({ where })
})

router.get('count', async (req, res) => {
    const { username, course, tasks } = req.query
    const key = `${username}/${course}/${tasks}/`
    // 旧：服务器上
    const server = 0

    const oss = await getFileCount(key)
    res.success({
        server,
        oss
    })
})

export default router
