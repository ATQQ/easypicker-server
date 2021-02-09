import { GlobalError } from '@/constants/errorMsg'
import Router from '@/lib/Router'

// db
import { addReport, deleteReportById, selectReportById, selectReportByUsername } from '@/db/reportDb'
import { deleteObjByKey } from '@/utils/qiniuUtil'

// util


const router = new Router('report')

/**
 * 管理员获取所有的文件信息
 */
router.get('report', async (req, res) => {
    const { username } = req.query
    const reportList = await selectReportByUsername(username)
    res.success({
        reportList
    })
})

router.post('save', async (req, res) => {
    const date = new Date()

    const data = await addReport({
        date,
        ...req.data
    })

    // TODO: 添加重复提交的判断逻辑
    if (data.affectedRows !== 1) {
        return res.failWithError(GlobalError.unknown)
    }
    res.success()
})

router.delete('report', async (req, res) => {
    const { id } = req.data
    const report = (await selectReportById(id))[0]
    const { username, course, tasks, filename } = report
    // 删除OSS中的资源
    deleteObjByKey(`${username}/${course}/${tasks}/${filename}`)
    // TODO: 删除逻辑完善
    // 删除数据库中的资源
    const data = await deleteReportById(id)
    if (data.affectedRows !== 1) {
        return res.failWithError(GlobalError.unknown)
    }
    return res.success()
})

export default router