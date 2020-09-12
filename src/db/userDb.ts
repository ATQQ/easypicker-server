import { query } from './../lib/dbConnect'
import { User } from '@/db/modal'
import { OkPacket } from 'mysql';

export function selectUserByUsername(username: string) {
    const sql = 'select * from user where account = ?'
    return query<User[]>(sql, username)
}

export function insertUser(username: string, password: string, isBindMobile: boolean = false, mobile?: string) {
    let sql = 'insert into user ';
    if (isBindMobile) {
        return query<OkPacket>(sql + '(username,password,mobile) values (?,?,?)', username, password, mobile)
    }
    return query<OkPacket>(sql + '(username,password) values (?,?)', username, password)
}