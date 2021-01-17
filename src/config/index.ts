export const serverConfig = {
    port: 3000,
    hostname: 'localhost'
}

// // 判断环境
// if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
//     config = proConfig
// }

export const dbConfig = {
    host: 'sugarat.top',
    port: 3306,
    database: 'node_picker',
    user: 'node_picker',
    password: '52txkRLnLKYGKCWp'
}

// 通过环境变量注入
const { QINIU_ACCESS_KEY, QINIU_SECRET_KEY } = process.env

export const qiniuConfig = {
    accessKey: QINIU_ACCESS_KEY,
    secretKey: QINIU_SECRET_KEY
}