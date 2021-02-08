import { LinkedList } from '.'

export const findLinkedList = <T>(list: LinkedList<T>, filter: (object: T) => boolean): T | undefined => {
    let entry = list.next()
    while (entry !== undefined) {
        if (filter(entry.item)) {
            return entry.item
        }
        entry = list.next(entry)
    }
    return undefined
}
