import { ITranslator, EventName } from 'inno-trans/lib/types'
import { useEffect } from 'react'
import useForceUpdate from 'use-force-update'

declare module 'inno-trans/lib/types' {
    interface ITranslator {
        useT (): this
    }
}

export = function plugin (t: ITranslator) {
    t.useT = useT.bind(t)
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
    }, [])
    return this
}
