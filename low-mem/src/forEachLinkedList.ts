import { LinkedList } from '.'

export const forEachLinkedList = <T>(list: LinkedList<T>, callback: (object: T) => void): void => {
    let entry = list.next()
    while (entry !== undefined) {
        callback(entry.item)
        entry = list.next(entry)
    }
}
