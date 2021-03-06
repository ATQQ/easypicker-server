import crypto from 'crypto'

/**
 * 加密字符串(md5+base64)
 * @param str 待加密的字符串
 */
export function encryption(str: string): string {
    return crypto.createHash('md5').update(str).digest('base64')
}

export function lowCamel2Underscore(word: string): string {
    const letters = word.split('')
    return letters.reduce((pre, letter) => {
        return pre + (/[A-Z]/.test(letter) ? `_${letter.toLowerCase()}` : letter)
    }, '')
}