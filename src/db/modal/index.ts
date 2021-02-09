/**
 * 用户权限
 */
export enum UserPower {
    /**
     * 管理员(注册用户均为管理员)
     */
    admin = 6,

    /**
     * 超级管理员
     */
    superAdmin = 0
}

/**
 * 用户状态
 */
export enum UserStatus {
    /**
     * 正常
     */
    normal = 1,
    /**
     * 冻结
     */
    freeze = 0
}

export interface User {
    /**
     * 主键
     */
    id: number
    /**
     * 用户名
     */
    username: string
    /**
     * 密码
     */
    password: string
    /**
     * 用户状态
     */
    status: UserStatus
    /**
     * 用户权限
     */
    power: UserPower
    /**
     * 注册日期
     */
    date: number
    /**
     * 手机号
     */
    mobile?: string
}

export interface Report {
    id: number

    name: string

    course: string

    tasks: string

    filename: string

    date: Date

    username: string
}

export interface Course {
    id?: number;
    name?: string;
    type?: number
    parent?: number
    username?: string
}

export interface ChildContent {
    id?: number

    tasksid?: number

    template?: string

    ddl?: Date

    people?: string
}

export interface People {
    id?: number
    peopleName?: string
    people_name?: string
    adminUsername?: string
    admin_username?: string
    parentName?: string
    parent_name?: string
    childName?: string
    child_name?: string
    status?: number
    lastDate?: Date
    last_date?: Date
}