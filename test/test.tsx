import test from 'ava'
import * as React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import InnoTrans = require('inno-trans')
import InnoTransReactPlugin = require('../src/index')

import './_browser'
InnoTrans.use(InnoTransReactPlugin)

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
    act(() => { trans.locale('b') })
    t.is(result.current, 'zzz')
    act(() => { trans.locale('c') })
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
    act(() => { trans.addFilter('b', v => `~${v}~`) })
    t.is(result.current, 'aaa~z~')
    act(() => { trans.addFilter('a', v => `%${v}%`) })
    t.is(result.current, 'aaa~%z%~')
})

test.only('child are not rerendered more than once,', t => {
    const trans = InnoTrans({ locale: 'a' })
    let calls = 0

    renderHook(() => {
        trans.useT()
        calls++
    }, {
        wrapper: ({ children }) => {
            trans.useT()
            calls++
            return <>{children}</>
        }
    })

    t.is(calls, 2)
    act(() => { trans.locale('b') })
    t.is(calls, 4)
})
