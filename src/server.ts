// 编译后的绝对路径映射插件
import 'module-alias/register'

// diy module 自建模块
import { serverConfig } from '@/config'
import FW from './lib/server'

// routes
import routes from './routes'

const app = new FW()
app.addRoutes(routes)

app.listen(serverConfig.port, serverConfig.hostname, () => {
    console.log('success')
})
