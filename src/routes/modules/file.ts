import { UserPower } from '@/db/modal'
import { addPeople, selectPeople } from '@/db/peopleDb'
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
}, { power: UserPower.admin })

router.post('people', async (req, res) => {
    const { file, parent, child, username } = req.data
    const people = file.split('\n').map(v => v.replace(/\r|\n/g, '')).filter(v => v)
    const notOkPeople = []
    const okPeople = []
    for (const one of people) {
        const isExist = (await selectPeople({
            peopleName: one,
            adminUsername: username,
            childName: child,
            parentName: parent
        })).length !== 0

        if (isExist) {
            notOkPeople.push(one)
        } else {
            okPeople.push(one)
        }
    }
    if (okPeople.length === 0) {
        res.success({
            failCount: notOkPeople.length,
            successCount: 0,
            people: notOkPeople
        })
        return
    }
    const data = await addPeople(okPeople, username, child, parent)

    res.success({
        failCount: notOkPeople.length,
        successCount: data.affectedRows,
        people: notOkPeople
    })
}, { power: UserPower.admin })
export default router
