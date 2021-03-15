import { childContentType } from '@/constants/dbModalParam'
import { childContentError } from '@/constants/errorMsg'
import { addChildContent, selectChildContent, updateChildContentByPrimaryKey } from '@/db/childContentDb'
import { selectCourse } from '@/db/courseDb'
import { UserPower } from '@/db/modal'
import Router from '@/lib/Router'
import { deleteObjByKey } from '@/utils/qiniuUtil'

const router = new Router('childContent')

router.get('childContent', async (req, res) => {
    const { taskid } = req.query
    const data = {}
    if (!taskid) {
        return res.success(data)
    }
    const childContent = await selectChildContent({ tasksid: taskid })
    if (childContent.length === 0) {
        return res.failWithError(childContentError.notExist)
    }
    const { ddl, template, people } = childContent[0]
    return res.success({
        ddl: ddl?.getTime(),
        template,
        people
    })
})

router.put('childContent', async (req, res) => {
    const { taskid, type, ddl, template, people } = req.data

    // 参数非法
    if (!taskid || ![1, 2, 3].includes(type)) {
        return res.failWithError(childContentError.paramError)
    }

    // 不存在则创建新的
    const childContent = (await selectChildContent({ tasksid: taskid }))[0]
    if (!childContent) {
        addChildContent({
            tasksid: taskid,
            ddl,
            template,
            people
        })
        return res.success()
    }

    const { id } = childContent
    switch (type) {
        case childContentType.DDL:
            updateChildContentByPrimaryKey(id, { ddl: new Date(ddl) })
            break
        case childContentType.PEOPLE:
            updateChildContentByPrimaryKey(id, { people })
            break
        case childContentType.TEMPLATE:
            // 删除旧文件
            const child = (await selectCourse({
                id: taskid,
            }))[0]
            if (!child.parent) return
            const parent = (await selectCourse({
                id: child.parent
            }))[0]
            if (!parent) return
            const key = `${parent.username}/${parent.name}/${child.name}_Template/${childContent.template}`
            deleteObjByKey(key)
            updateChildContentByPrimaryKey(id, { template })
            break
        default:
            break
    }
    res.success()
}, { power: UserPower.admin })
export default router