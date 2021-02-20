import { GlobalError } from '@/constants/errorMsg'
import Router from '@/lib/Router'

// db
import {
    addCourse,
    deleteCourseById,
    deleteCourseByParent,
    selectCourse,
} from '@/db/courseDb'

// util
import { CourseListType, CourseType } from '@/constants/dbModalParam'
import { UserPower } from '@/db/modal'
import { deleteChildContentByCourseId } from '@/db/childContentDb'

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
            parent,
        })
    }

    // 查询父类
    if (!parent && type === CourseType.PARENT) {
        data = await selectCourse({
            name,
            type,
            username,
        })
    }
    if (data?.length !== 0) {
        return res.success({
            status: false,
        })
    }

    // 落库
    const status = await addCourse(course)

    if (status.affectedRows !== 1) {
        return res.failWithError(GlobalError.unknown)
    }
    res.success({
        id: status.insertId,
        status: true,
    })
}, { power: UserPower.admin, userSelf: true })

router.delete('del', async (req, res) => {
    const { id, type } = req.data
    let status = false
    if (type === CourseType.PARENT) {
        // 先删父类
        deleteCourseById(id, type)
        // 删除其子
        deleteCourseByParent(id)
        status = true
    }
    if (type === CourseType.CHILD) {
        deleteChildContentByCourseId(id)
        deleteCourseById(id, type)
        status = true
    }

    return res.success({ status })
}, { power: UserPower.admin })

router.get('check', async (req, res) => {
    const { range, contentid, username } = req.query
    if (!range || !contentid || !username) {
        return res.success()
    }

    let data = []
    if (range === 'parents') {
        data = (await selectCourse({ username })).filter((v) => !v.parent)
    } else if (range === 'children') {
        data = await selectCourse({ parent: contentid, username })
    }
    // 格式化
    const courseList = data.map((course) => {
        const { name, id } = course
        return { name, id }
    })
    return res.success({
        courseList,
    })
})

router.get('course', async (req, res) => {
    const { type, parent, child, username } = req.query
    let status = false

    const parentCourse = (
        await selectCourse({
            type: CourseType.PARENT,
            username,
            name: parent,
        })
    )[0]

    if (type == CourseListType.PARENT && parentCourse) {
        status = true
        return res.success({ status, data: parentCourse })
    }
    if (type == CourseListType.CHILDREN && parentCourse) {
        const pId = parentCourse.id
        status = true
        const data = (await selectCourse({
            username,
            parent: pId,
            name: child,
        }))[0]
        return res.success({ status, data })
    }
    return res.success({ status })
})

router.get('node', async (req, res) => {
    const { username } = req.query
    const courseList = await selectCourse({ username })
    res.success({ courseList })
}, { power: UserPower.admin, userSelf: true })
export default router