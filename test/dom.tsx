// tslint:disable:no-duplicate-string
import test from 'ava'
import * as React from 'react'
import { trans, rt, rtc } from './_helpers'

const dom = (desc: string, actual: any, expected: any) => test('dom : ' + desc, t => t.deepEqual(actual, expected))

dom('string',
    rt('test', {}),
    <>test</>
)

dom('wrapped',
    rt('a <0>b</0>', { 0: <span /> }),
    <>a <span>b</span></>
)

dom('wrapped with props',
    rt('a <0>b</0>', { 0: <span className='abc' title='efg'/> }),
    <>a <span className='abc' title='efg'>b</span></>
)

dom('self closed',
    rt('a <0/>b', { 0: <br/> }),
    <>a <br/>b</>
)

dom('nested',
    rt('ab<0>de<1>ef</1>gh</0>', { 0: <div />, 1: <p /> }),
    <>ab<div>de<p>ef</p>gh</div></>
)

dom('transChoice #1',
    rtc('single|<0>many</0>', 2, { 0: <div /> }),
    <><div>many</div></>
)

dom('transChoice #2',
    rtc('one|[1,3]<0>two</0>|<1>many</2>', 3, { 0: <p />, 1: <div/> }),
    <><p>two</p></>
)

dom('function value',
    rt('a <0>b</0>', { 0: (children: any) => <span>{children}</span> }),
    <>a <span>b</span></>
)

dom('function value with nested #1',
    rt('a <0>b<1>c</1></0>', { 0: (children: any) => <span>{children}</span>, 1: <div/> }),
    <>a <span><>b<div>c</div></></span></>
)

dom('function value with nested #2',
    rt('a <0>b<1>c</1></0>', { 0: (children: any) => <span>{children}</span>, 1: {} }),
    <>a <span><>b<>c</></></span></>
)

dom('function value with nested #3',
    rt('a <0>b<1 /></0>', { 0: (children: any) => <span>{children}</span> }),
    <>a <span><>b{null}</></span></>
)

dom('function value with nested #4',
    rt('a <0>b<1>c</1></0>', { 0: (children: any) => <span>{children}</span>, 1: (children: any) => <p>{children}</p> }),
    <>a <span><>b<p>c</p></></span></>
)

dom('function value with nested #5',
    rt('a <0>b<1>c</1>d</0>', { 0: (children: any) => <span>{children}</span>, 1: (children: any) => <p>{children}</p> }),
    <>a <span><>b<p>c</p>d</></span></>
)

test('A missing message returns a key.', t => {
    t.is(trans.rt('no message <0/>', { 0: <br/> }), 'no message <0/>')

    const obj = {}
    t.is(trans.rt('no message <0/>', { 0: <br/> }, { defaults: obj }), obj)
})
