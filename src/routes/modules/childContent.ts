import { childContentType } from '@/constants/dbModalParam'
import { childContentError } from '@/constants/errorMsg'
import { addChildContent, selectChildContent, updateChildContentByPrimaryKey } from '@/db/childContentDb'
import Router from '@/lib/Router'

// db

// util


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
        ddl,
        template,
        people
    })
})

// TODO：路由拼写问题
router.put('childContext', async (req, res) => {
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
            // todo: 删除旧文件
            updateChildContentByPrimaryKey(id, { template })
            break
        default:
            break
    }
    res.success()
})
export default router