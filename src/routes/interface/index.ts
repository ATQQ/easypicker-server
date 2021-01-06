export interface LoginData {
    username: string
    password: string
}

export interface Mobile {
    mobile: string
}

export interface RegisterData {
    username: string,
    password: string,
    mobile?: string,
    code?: string
}