import { query } from '@/lib/dbConnect'
import { ChildContent } from '@/db/modal'
import { OkPacket } from 'mysql'

export function selectChildContent(childContent: ChildContent): Promise<ChildContent[]> {
    const keys = Object.keys(childContent)
    const values = keys.map(key => childContent[key])
    const sql = `select * from childcontent where ${keys.map(key => `${key} = ?`).join(' and ')}`
    return query<ChildContent[]>(sql, ...values)
}
export function addChildContent(childContent: ChildContent): Promise<OkPacket> {
    const keys = Object.keys(childContent)
    const values = keys.map(key => childContent[key])

    const sql = `insert into childcontent (${keys.join(',')}) values (${new Array(keys.length).fill('?').join(',')})`
    return query<OkPacket>(sql, ...values)
}
export function updateChildContentByPrimaryKey(id: number, childContent: ChildContent): Promise<OkPacket> {
    const keys = Object.keys(childContent)
    const values = keys.map(key => childContent[key])

    const sql = `update childcontent set ${keys.map(key => `${key} = ?`).join(',')} where id = ${id}`
    return query<OkPacket>(sql, ...values)
}

export function deleteChildContentByCourseId(taskId: number): Promise<OkPacket> {
    const sql = 'delete from childcontent where tasksid = ?'
    return query<OkPacket>(sql, taskId)
}