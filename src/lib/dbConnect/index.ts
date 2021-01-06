import mysql from 'mysql'
import { dbConfig } from '@/config'
// 创建连接池
const pool = mysql.createPool(dbConfig)

let connection: mysql.PoolConnection = null

export function refreshConnection(): Promise<unknown> {
    return new Promise<void>((res, rej) => {
        if (connection) {
            connection.release()
        }
        pool.getConnection((err, coon) => {
            if (err) {
                console.error('------ db connection error -------')
                console.error(err)
                console.log('ready reConnect')
                rej(err)
                return
            }
            console.log('init db connection success')
            res()
            connection = coon

            connection.on('error', function (err) {
                console.log('connection err')
            })
        })
    })
}

refreshConnection()

pool.on('connection', function () {
    console.log('ready init db connection')
})

pool.on('release', function () {
    console.log('wait connection release')
    refreshConnection()
})

pool.on('error', function (err) {
    console.log('pool connect error')
    console.error(err)
    refreshConnection()
})

type param = string | number
/**
 * 执行sql语句
 * @param sql sql语句 
 * @param params 参数 
 */
export function query<T>(sql: string, ...params: param[]): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        connection.query(sql, params, (err, result) => {
            if (err) {
                reject(err)
                return
            }
            resolve(result)
        })
    })
}