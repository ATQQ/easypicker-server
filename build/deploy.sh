# /bin/bash
compressDir="./src package.json tsconfig.json yarn.lock"               # 压缩目录 
compressFile="ep-server.tar.gz"        # 压缩后的文件名
user="root"                         # 远程登录用户
origin="sugarat.top"                   # 远程登录origin
targetDir="/www/wwwroot/ep.sugarat.top/server"     # 目标目录
echo "开始-----归档解压"
tar -zvcf ${compressFile} ${compressDir}
echo "开始-----拷贝至服务器"
scp ${compressFile} ${user}@${origin}:./
echo "开始-----部署"
ssh -p22 ${user}@${origin} "rm -rf ${targetDir}/* && tar -zvxf ${compressFile} -C ${targetDir}"
echo "开始-----安装依赖"
ssh -p22 ${user}@${origin} "cd ${targetDir} && yarn install"
echo "开始-----pm2运行"
ssh -p22 ${user}@${origin} "cd ${targetDir}/../ && pm2 restart ecosystem.config.js --env production"
echo "清理-----临时的文件"
rm -rf $compressFile