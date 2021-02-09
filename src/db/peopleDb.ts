import { query } from '@/lib/dbConnect'
import { People } from '@/db/modal'
import { OkPacket } from 'mysql'
import { lowCamel2Underscore } from '@/utils/stringUtil'

export function selectPeople(people: People): Promise<People[]> {
    const keys = Object.keys(people)
    const values = keys.map(key => people[key])
    const sql = `select * from peoplelist where ${keys.map(key => `${lowCamel2Underscore(key)} = ?`).join(' and ')}`
    console.log(sql, values)

    return query<People[]>(sql, ...values)
}

export function deletePeopleById(id: number): Promise<OkPacket> {
    const sql = 'delete from peoplelist where id = ?'
    return query<OkPacket>(sql, id)
}

export function addPeople(names: string[], username: string, child: string, parent: string): Promise<OkPacket> {
    const values = new Array(names.length).fill(`(?,'${username}','${parent}','${child}',0)`).join(',')
    const sql = `insert into peoplelist(people_name,admin_username,parent_name,child_name,status) values ${values}`
    return query<OkPacket>(sql, ...names)
}