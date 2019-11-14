// import { add } from './utils'

// console.log(add(2, 3))

console.log(function path(q: string) {
    return import(Math.random() > 0.5 ? q : '/src/')
})
