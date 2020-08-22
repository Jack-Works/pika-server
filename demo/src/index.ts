console.log('Hello world!')
import mui from 'lodash-es'
console.log(mui)

export default function<T extends number>(): T {
    return Math.random() as T
}
