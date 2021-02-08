export interface ILinkedList<T> {
    length(): number
    next(entry?: LinkedListEntry<T>): LinkedListEntry<T> | undefined
    add(object: T): void
    remove(object: T): void
}

export interface LinkedListEntry<T> {
    item: T
    next: LinkedListEntry<T> | undefined
}

export class LinkedList<T> implements ILinkedList<T> {
    private _length: number
    private _free: LinkedListEntry<T> | undefined
    private _first: LinkedListEntry<T> | undefined

    constructor() {
        this._length = 0
        this._free = undefined
        this._first = undefined
    }

    length(): number {
        return this._length
    }

    next(entry?: LinkedListEntry<T>): LinkedListEntry<T> | undefined {
        if (entry === undefined) {
            return this._first
        }
        return entry.next
    }

    private allocate(object: T): LinkedListEntry<T> {
        let entry: LinkedListEntry<T>
        if (this._free !== undefined) {
            entry = this._free
            entry.item = object
            entry.next = undefined
            this._free = entry.next
        } else {
            entry = {
                item: object,
                next: undefined
            }
        }
        return entry
    }

    add(object: T): void {
        const entry = this.allocate(object)
        entry.next = this._first
        this._first = entry
        this._length += 1
    }

    sortedAdd(object: T, sort: (a: T, b: T) => number): void {
        const entry = this.allocate(object)
        this._length += 1
        if (this._first === undefined) {
            this._first = entry
            return
        }
        let current: LinkedListEntry<T> | undefined = this._first
        let previous = undefined
        while (current !== undefined) {
            if (sort(entry.item, current.item) <= 0) {
                entry.next = current
                if (previous === undefined) {
                    this._first = entry
                } else {
                    previous.next = entry
                }
                return
            }
            previous = current
            current = current.next
        }
        previous!.next = entry
    }

    remove(object: T): void {
        let previous: LinkedListEntry<T> | undefined = undefined
        let entry = this._first
        while (entry !== undefined) {
            if (entry.item === object) {
                if (previous === undefined) {
                    this._first = entry.next
                } else {
                    previous.next = entry.next
                }
                entry.next = this._free
                this._free = entry
                this._length -= 1
                return
            }
            previous = entry
            entry = entry.next
        }
    }

    clear() {
        if (this._free === undefined) {
            this._free = this._first
        } else {
            let last = this._free
            while (last.next !== undefined) {
                last = last.next
            }
            last.next = this._first
        }
        this._first = undefined
        this._length = 0
    }
}
