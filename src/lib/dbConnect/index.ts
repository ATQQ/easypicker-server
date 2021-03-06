import mysql from 'mysql'
import { dbConfig } from '@/config'
// 创建连接池
const pool = mysql.createPool(dbConfig)

export function getConnection(): Promise<mysql.PoolConnection> {
    return new Promise((res, rej) => {
        pool.getConnection((err, coon) => {
            if (err) {
                console.error('------ db connection error -------')
                console.error(err)
                rej(err)
                return
            }
            res(coon)
        })
    })
}


// pool.on('connection', function () {
//     console.log('mysql: ready init db connection')
// })

// pool.on('release', function () {
//     console.log('wait connection release')
// })

pool.on('error', function (err) {
    console.log('pool connect error')
    console.error(err)
})

type param = string | number | any
/**
 * 执行sql语句
 * @param sql sql语句 
 * @param params 参数 
 */
export function query<T>(sql: string, ...params: param[]): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        getConnection().then((coon) => {
            coon.query(sql, params, (err, result) => {
                if (err) {
                    reject(err)
                    return
                }
                // 请求完就释放
                coon.release()
                resolve(result)
            })
        }).catch((err) => {
            reject(err)
        })
    })
}