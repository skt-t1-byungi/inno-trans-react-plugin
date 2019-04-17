import InnoTrans = require('inno-trans')
import InnoTransReactPlugin = require('../src/index')

InnoTrans.use(InnoTransReactPlugin)
export const trans = InnoTrans({ locale: 'en' })

export const useT = trans.useT

export const rt = (key: string, values: any) => {
    trans.addMessages('en', { [key]: key })
    return trans.rt(key, values)
}

export const rtc = (key: string, num: number, values: any) => {
    trans.addMessages('en', { [key]: key })
    return trans.rtc(key, num, values)
}
