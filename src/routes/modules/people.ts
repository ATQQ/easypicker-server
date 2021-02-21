import { GlobalError, peopleError } from '@/constants/errorMsg'
import Router from '@/lib/Router'

// db
import { deletePeopleById, selectPeople } from '@/db/peopleDb'
import { PeopleStatue } from '@/constants/dbModalParam'
import { UserPower } from '@/db/modal'
// util


const router = new Router('people')

router.get('peopleList', async (req, res) => {
    const { username, parent, child } = req.query

    const people = await selectPeople({
        adminUsername: username,
        childName: child,
        parentName: parent
    })

    const data = people.map(v => {
        const { id, people_name: name, status, last_date } = v
        const date = last_date ? last_date : false
        return {
            id,
            name,
            status,
            date
        }
    })
    res.success(data)
}, { power: UserPower.admin, userSelf: true })

router.get('people', async (req, res) => {
    const { username, parent, child, name } = req.query
    const people = await selectPeople({
        adminUsername: username,
        peopleName: name,
        parentName: parent,
        childName: child
    })
    if (people?.length === 0) {
        res.failWithError(peopleError.notExist)
        return
    }
    const isSubmit = people[0].status === PeopleStatue.SUBMIT

    res.json({
        code: 200,
        data: {
            isSubmit
        },
        errMsg: isSubmit ? '已提交' : '未提交'
    })
})

router.delete('people', async (req, res) => {
    const { id } = req.data
    const data = await deletePeopleById(id)
    if (data.affectedRows === 0) {
        res.failWithError(GlobalError.dbError)
        return
    }
    res.success()
}, { power: UserPower.admin })

export default router