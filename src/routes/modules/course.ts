import { GlobalError } from '@/constants/errorMsg'
import Router from '@/lib/Router'

// db
import { addCourse, deleteCourseById, selectCourse } from '@/db/courseDb'

// util
import { CourseType } from '@/constants/dbModalParam'

const router = new Router('course')

router.put('add', async (req, res) => {
    const course = req.data
    const { parent, name, type, username } = course

    let data: any = []
    // 查询子类
    if (parent && type === CourseType.CHILD) {
        data = await selectCourse({
            name,
            type,
            parent
        })
    }

    // 查询父类
    if (!parent && type === CourseType.PARENT) {
        data = await selectCourse({
            name,
            type,
            username
        })
    }
    // TODO: 已存在
    if (data?.length !== 0) {
        return res.fail(500, 'already exist')
    }

    // 落库
    data = await addCourse(course)
    if (data.affectedRows !== 1) {
        return res.failWithError(GlobalError.unknown)
    }
    res.success()
})

router.delete('del', async (req, res) => {
    const { id, type } = req.data
    const data = await deleteCourseById(id, type)
    if (data.affectedRows !== 1) {
        return res.failWithError(GlobalError.unknown)
    }
    return res.success()
})
// router.post('save', async (req, res) => {
//     const date = new Date()

//     const data = await addReport({
//         date,
//         ...req.data
//     })

//     // TODO: 添加重复提交的判断逻辑
//     if (data.affectedRows !== 1) {
//         return res.failWithError(GlobalError.unknown)
//     }
//     res.success()
// })

// router.delete('report', async (req, res) => {
//     const { id } = req.data
//     const data = await deleteReportById(id)
//     if (data.affectedRows !== 1) {
//         return res.failWithError(GlobalError.unknown)
//     }
//     return res.success()
// })

export default router