# inno-trans-react-plugin
A inno-trans plugin for react.

[![npm](https://flat.badgen.net/npm/v/inno-trans-react-plugin)](https://www.npmjs.com/package/inno-trans-react-plugin)

## Install
```sh
npm i inno-trans-react-plugin
```

## Example
```js
const InnoTrans = require('inno-trans');
const InnoTransReactPlugin = require('inno-trans-react-plugin');

const trans = InnoTrans({
    locale: 'en',
    message: {
        en: {
            'hello': 'hello!'
        },
        ko: {
            'hello': '안녕!'
        }
    },
    plugins: [InnoTransReactPlugin] // 1. Add a plugin.
})

function App(){
    const {t} = trans.useT() // 2. You can now use the `useT()` hook.

    return <span>{ t('hello') }</span> // => "<span>hello</span>"
}

trans.locale('ko') // App rerenders like "<span>안녕!</span>"
```

## Related
- [inno-trans](https://github.com/skt-t1-byungi/inno-trans) - 📜 simple localization library (inspired by laravel translation)

## License
MIT
