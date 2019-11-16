console.log('Hello world!')

export default function<T extends number>(): T {
    return Math.random() as T
}
