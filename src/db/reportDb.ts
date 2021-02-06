import { query } from '@/lib/dbConnect'
import { Report } from '@/db/modal'
import { OkPacket } from 'mysql'

export function selectReportByUsername(username: string): Promise<Report[]> {
    const sql = 'select * from report where username = ?'
    return query<Report[]>(sql, username)
}

export function addReport(report: Report): Promise<OkPacket> {
    const keys = Object.keys(report)
    const values = keys.map(key => report[key])

    const sql = `insert into report (${keys.join(',')}) values (${new Array(keys.length).fill('?').join(',')})`
    return query<OkPacket>(sql, ...values)
}

export function deleteReportById(id: string): Promise<OkPacket> {
    const sql = 'delete from report where id = ?'
    return query<OkPacket>(sql, id)
}