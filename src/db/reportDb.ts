import { query } from '@/lib/dbConnect'
import { Report } from '@/db/modal'
import { OkPacket } from 'mysql'

export function selectReportById(id: number): Promise<Report[]> {
    const sql = 'select * from report where id = ?'
    return query<Report[]>(sql, id)
}

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

export function deleteReportById(id: number): Promise<OkPacket> {
    const sql = 'delete from report where id = ?'
    return query<OkPacket>(sql, id)
}

export function selectReport(report: Report): Promise<Report[]> {
    const keys = Object.keys(report)
    const values = keys.map(key => report[key])
    const sql = `select * from report where ${keys.map(key => `${key} = ?`).join(' and ')}`
    return query<Report[]>(sql, ...values)
}