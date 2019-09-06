import { ITranslator } from 'inno-trans/lib/types'
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
        this.on('*', forceUpdate)
        return () => this.off('*', forceUpdate)
    }, [])
    return this
}
