import { codeMsg } from '.'

export const UserError = {
    mobile: {
        fault: codeMsg(20014, 'Mobile is not right'),
        exist: codeMsg(20012, 'Mobile already exist')
    },
    account: {
        exist: codeMsg(20013, 'Account already exist')
    },
    code: {
        fault: codeMsg(20020, 'Error code')
    }
}

export const GlobalError = {
    unknown: codeMsg(500, 'UnKnown Error'),
    dbError: codeMsg(500, 'Database Error')
}