export const serverConfig = {
    port: 3000,
    hostname: 'localhost'
}

// // 判断环境
// if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
//     config = proConfig
// }

// 开发环境的测试数据库
export const dbConfig = {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PWD
}

// 通过环境变量注入
const { QINIU_ACCESS_KEY, QINIU_SECRET_KEY } = process.env

export const qiniuConfig = {
    accessKey: QINIU_ACCESS_KEY,
    secretKey: QINIU_SECRET_KEY
}