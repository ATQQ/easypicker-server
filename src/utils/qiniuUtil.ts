import { qiniuConfig } from '@/config'
import qiniu from 'qiniu'

// 七牛云相关
const mac = new qiniu.auth.digest.Mac(qiniuConfig.accessKey, qiniuConfig.secretKey)
const config = new qiniu.conf.Config()
const bucketManager = new qiniu.rs.BucketManager(mac, config)
const privateBucketDomain = 'http://easypicker.file.sugarat.top'
const deadline = Math.floor(Date.now() / 1000) + 3600 * 12 // 12小时过期

/**
 * 获取OSS上文件的下载链接（默认12h有效）
 * @param key 文件的key
 * @param expiredTime 
 */
export function createDownloadUrl(key: string, expiredTime = deadline): string {
    return bucketManager.privateDownloadUrl(privateBucketDomain, key, expiredTime)
}