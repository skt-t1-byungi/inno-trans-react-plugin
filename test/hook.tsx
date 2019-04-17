import test from 'ava'
import { renderHook, act } from 'react-hooks-testing-library'
import InnoTrans = require('inno-trans')

import './_browser'
import './_helpers'

test('change locale', t => {
    const trans = InnoTrans({
        messages: {
            a: { aa: 'ddd' },
            b: { aa: 'zzz' }
        },
        locale: 'a'
    })

    const { result } = renderHook(() => trans.useT().t('aa'))
    t.is(result.current, 'ddd')
    act(() => trans.locale('b'))
    t.is(result.current, 'zzz')
    act(() => trans.locale('c'))
    t.is(result.current, 'aa')
})

test('add filter', t => {
    const trans = InnoTrans({
        messages: {
            a: { aa: 'aaa{0|a|b}' }
        },
        locale: 'a'
    })

    const { result } = renderHook(() => trans.useT().t('aa', { 0: 'z' }))
    t.is(result.current, 'aaaz')
    act(() => trans.addFilter('b', v => `~${v}~`))
    t.is(result.current, 'aaa~z~')
    act(() => trans.addFilter('a', v => `%${v}%`))
    t.is(result.current, 'aaa~%z%~')
})
