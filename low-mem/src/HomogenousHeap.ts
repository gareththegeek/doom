import { LinkedList } from '.'

export class HomogenousHeap<T> {
    private _free: LinkedList<T>
    private _constructor: () => T

    constructor(constructor: () => T) {
        this._free = new LinkedList()
        this._constructor = constructor
    }

    allocate(): T {
        const result = this._free.next()
        if (result !== undefined) {
            this._free.remove(result.item)
            return result.item
        } else {
            return this._constructor()
        }
    }

    free(object: T): void {
        this._free.add(object)
    }
}
