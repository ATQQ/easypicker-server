# /bin/bash
compressDir="./src package.json tsconfig.json yarn.lock"               # 压缩目录 
compressFile="ep-server.tar.gz"        # 压缩后的文件名
user="root"                         # 远程登录用户
origin="sugarat.top"                   # 远程登录origin
targetDir="/www/wwwroot/ep.sugarat.top/server"     # 目标目录
echo "开始-----部署"
ssh -p22 ${user}@${origin} "rm -rf ${targetDir}/* && tar -zvxf ${compressFile} -C ${targetDir}"
echo "开始-----安装依赖"
ssh -p22 ${user}@${origin} "cd ${targetDir} && yarn install"
echo "开始-----重新启动"
ssh -p22 ${user}@${origin} "cd ${targetDir}/../ && cp ecosystem.config.js ${targetDir}/ && cd ${targetDir} && pm2 restart ecosystem.config.js --env production"
echo "清理-----临时的文件"
rm -rf $compressFile