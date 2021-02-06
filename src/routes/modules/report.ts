import { GlobalError } from '@/constants/errorMsg'
import Router from '@/lib/Router'

// db
import { addReport, deleteReportById, selectReportByUsername } from '@/db/reportDb'

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
    if (data.affectedRows !== 1) {
        return res.failWithError(GlobalError.unknown)
    }
    res.success()
})

router.delete('report', async (req, res) => {
    const { id } = req.data
    const data = await deleteReportById(id)
    if (data.affectedRows !== 1) {
        return res.failWithError(GlobalError.unknown)
    }
    return res.success()
})

export default router