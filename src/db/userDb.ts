import { query } from '@/lib/dbConnect'
import { User, UserPower, UserStatus } from '@/db/modal'
import { OkPacket } from 'mysql'

export function selectUserByUsername(username: string): Promise<User[]> {
    const sql = 'select * from user where username = ?'
    return query<User[]>(sql, username)
}

export function insertUser(username: string, password: string, isBindMobile = false, mobile?: string): Promise<OkPacket> {
    const sql = 'insert into user '
    if (isBindMobile) {
        return query<OkPacket>(sql + '(username,password,mobile,status,power,date) values (?,?,?,?,?,?)', username, password, mobile, UserStatus.normal, UserPower.admin, new Date())
    }
    return query<OkPacket>(sql + '(username,password,status,power,date) values (?,?,?,?,?)', username, password, UserStatus.normal, UserPower.admin, new Date())
}