# /bin/bash
compressDir="./src package.json tsconfig.json yarn.lock" # 需要压缩目录 
compressFile="ep-server.tar.gz"        # 压缩后的文件名
echo "开始-----归档解压"
tar -zvcf ${compressFile} ${compressDir}