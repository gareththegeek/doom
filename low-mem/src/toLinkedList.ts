import { LinkedList } from '.'

export const toLinkedList = <T>(array: T[]): LinkedList<T> => {
    const result = new LinkedList<T>()
    for (const item of array) {
        result.add(item)
    }
    return result
}
