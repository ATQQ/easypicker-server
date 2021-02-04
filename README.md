# EasyPicker-Server

## 简介
EasyPicker1.0的Node服务端程序仓库

重构[java服务](https://github.com/ATQQ/EasyPicker)，为easypicker2做技术积累

体验：[EasyPicker1.0](https://ep.sugarat.top/)

## 快速启动
0. 如果没有安装yarn,请先安装yarn
```shell
npm install -g yarn
# 切换仓库源
yarn config set registry https://registry.npm.taobao.org -g
```

1. 安装依赖
```git
yarn install
```

2. 启动项目
```shell
yarn start
```
---

## 自定义实现
* [x] router(路由)
* [ ] localStorage(本地存储)
* [ ] tokenUtil
* [ ] 配置化接入redis
* [ ] 错误处理
* ...

## 数据库相关
* [x] mysql:完成基本配置与测试用例的编写
* ...

## 目录简介

```shell
src         # 主要代码目录
├── config  # 一些服务相关配置文件
├── db
│   ├── modal       # 数据表相关的TS types
│   └── userDb.ts   # 对相关表的操作示例
│
├── lib             # 自定义实现的一些模块代码
│   ├── README.md
│   ├── dbConnect   # 数据库链接模块
│   ├── enums       # 枚举
│   ├── router      # 路由模块
│   └── server      # 简单的服务框架模块
├── routes          # 服务端路由
├── server.ts       # 服务入口
└── utils           # 工具函数库
```
