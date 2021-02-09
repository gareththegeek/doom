import { LinkedList } from '.'

export const forEachLinkedListReverse = <T>(list: LinkedList<T>, callback: (object: T) => void): void => {
    let entry = list.prev()
    while (entry !== undefined) {
        callback(entry.item)
        entry = list.prev(entry)
    }
}
