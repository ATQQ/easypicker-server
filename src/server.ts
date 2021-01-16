// 编译后的绝对路径映射插件
import 'module-alias/register'
// 配置文件
import { serverConfig } from '@/config'

// diy module 自建模块
import FW from './lib/server'

// routes
import routes from './routes'

const app = new FW()
app.addRoutes(routes)

app.listen(serverConfig.port, serverConfig.hostname, () => {
    console.log('success')
})
