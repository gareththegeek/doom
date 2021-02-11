import { LinkedList } from '.'

export const toArray = <T>(list: LinkedList<T>): T[] => {
    let next = list.next()
    const actual: T[] = []
    while (next !== undefined) {
        actual.push(next.item)
        next = list.next(next)
    }
    return actual
}

export const toArrayReverse = <T>(list: LinkedList<T>): T[] => {
    let prev = list.prev()
    const actual: T[] = []
    while (prev !== undefined) {
        actual.push(prev.item)
        prev = list.prev(prev)
    }
    return actual
}
