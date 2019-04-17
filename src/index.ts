import parseTag = require('tag-name-parser')
import { ITranslator, TransOptions, ValueMap, EventName } from 'inno-trans/lib/types'
import { useEffect, createElement, Fragment, ReactNode, cloneElement, isValidElement } from 'react'
import useForceUpdate from 'use-force-update'

type TagNode = ReturnType<typeof parseTag>[number]

const DEFAULTS_SYMBOL = {}

declare module 'inno-trans/lib/types' {
    interface ITranslator {
        rt<Defaults= string> (key: string, values: ValueMap, opts?: TransOptions<Defaults>): ReactNode | Defaults
        rtc<Defaults= string> (key: string, num: number, values: ValueMap, opts?: TransOptions<Defaults>): ReactNode | Defaults
        useT (): this
    }
}

export = function plugin (t: ITranslator) {
    t.useT = useT.bind(t)
    t.rt = reactTrans.bind(t)
    t.rtc = reactTransChoice.bind(t)
}

function useT (this: ITranslator) {
    const forceUpdate = useForceUpdate()
    useEffect(() => {
        const events: EventName[] = [
            'changeLocale',
            'changeFallbacks',
            'changeTag',
            'addMessages',
            'removeMessages',
            'addFilter',
            'addFormatter'
        ]
        events.forEach(name => this.on(name, forceUpdate))
        return () => events.forEach(name => this.off(name, forceUpdate))
    })
    return this
}

function reactTrans<Defaults= string> (this: ITranslator, key: string, values: ValueMap, opts: TransOptions<Defaults>= {}) {
    const str = this.trans(key, values, { ...opts, defaults: DEFAULTS_SYMBOL })
    if (str === DEFAULTS_SYMBOL) return 'defaults' in opts ? opts.defaults! : key
    return strToReactElement(str as string, values)
}

function reactTransChoice<Defaults= string> (
    this: ITranslator, key: string, num: number, values: ValueMap, opts: TransOptions<Defaults>= {}
) {
    const str = this.transChoice(key, num, values, { ...opts, defaults: DEFAULTS_SYMBOL })
    if (str === DEFAULTS_SYMBOL) return 'defaults' in opts ? opts.defaults! : key
    return strToReactElement(str as string, values)
}

function strToReactElement (str: string, values: ValueMap) {
    return createElement(Fragment, undefined, ...nodesToReactNodes(parseTag(str), values))
}

function nodesToReactNodes (nodes: TagNode[], values: ValueMap): ReactNode[] {
    return nodes.map(node => nodeToReactNode(node, values))
}

function nodeToReactNode (node: TagNode, values: ValueMap): ReactNode {
    if (typeof node === 'string') return node

    const val = values[node.name]
    if (node.single) {
        if (typeof val === 'function') {
            return val()
        } else {
            return isValidElement(val) ? val : null
        }
    }

    const children = nodesToReactNodes(node.children, values)
    if (typeof val === 'function') {
        return val(children)
    } else if (isValidElement(val)) {
        return cloneElement(val, undefined, ...children)
    } else {
        return createElement(Fragment, undefined, ...children)
    }
}
