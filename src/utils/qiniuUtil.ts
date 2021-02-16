import { qiniuConfig } from '@/config'
import qiniu from 'qiniu'

const privateBucketDomain = 'http://easypicker.file.sugarat.top'
const getDeadline = () => {
    // 12小时过期
    return Math.floor(Date.now() / 1000) + 3600 * 12
}

/**
 * 获取OSS上文件的下载链接（默认12h有效）
 * @param key 文件的key
 * @param expiredTime 
 */
export function createDownloadUrl(key: string, expiredTime = getDeadline()): string {
    // 七牛云相关
    const config = new qiniu.conf.Config()
    // 鉴权的内容，请求的时候生成，避免过期
    const mac = new qiniu.auth.digest.Mac(qiniuConfig.accessKey, qiniuConfig.secretKey)
    const bucketManager = new qiniu.rs.BucketManager(mac, config)

    return bucketManager.privateDownloadUrl(privateBucketDomain, key, expiredTime)
}