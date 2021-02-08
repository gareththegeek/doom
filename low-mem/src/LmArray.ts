export interface ILmArray<T> {
    length(): number
    get(index: number): T
    add(object: T): void
    remove(object: T): void
}

export class LmArray<T> implements ILmArray<T> {
    private _items: T[]
    private _maxLength: number
    private _length: number

    constructor() {
        this._maxLength = 0
        this._length = 0
        this._items = []
    }

    length(): number {
        return this._length
    }

    get(index: number): T {
        return this._items[index]
    }

    add(object: T): void {
        if (this._maxLength > this._length) {
            this._items[this._length] = object
            this._length += 1
        } else {
            this._maxLength += 1
            this._length += 1
            this._items.push(object)
        }
    }

    remove(object: T): void {
        const index = this._items.indexOf(object)
        if (index === -1) {
            return
        }
        for (let i = index + 1; i < this._length; i++) {
            this._items[i - 1] = this._items[i]
        }
        this._length -= 1
    }
}
