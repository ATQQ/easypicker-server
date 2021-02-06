import { query } from '@/lib/dbConnect'
import { Course } from '@/db/modal'
import { OkPacket } from 'mysql'

export function selectCourse(course: Course): Promise<Course[]> {
    const keys = Object.keys(course)
    const values = keys.map(key => course[key])
    const sql = `select * from course where ${keys.map(key => `${key} = ?`).join(' and ')}`
    return query<Course[]>(sql, ...values)
}

export function addCourse(course: Course): Promise<OkPacket> {
    const keys = Object.keys(course)
    const values = keys.map(key => course[key])

    const sql = `insert into course (${keys.join(',')}) values (${new Array(keys.length).fill('?').join(',')})`
    return query<OkPacket>(sql, ...values)
}

export function deleteCourseById(id: number, type: number): Promise<OkPacket> {
    const sql = 'delete from course where id = ? and type = ?'
    return query<OkPacket>(sql, id, type)
}