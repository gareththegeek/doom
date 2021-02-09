export interface LinkedListEntry<T> {
    item: T
    next: LinkedListEntry<T> | undefined
    prev: LinkedListEntry<T> | undefined
}

export class LinkedList<T> {
    private _length: number
    private _free: LinkedListEntry<T> | undefined
    private _first: LinkedListEntry<T> | undefined
    private _last: LinkedListEntry<T> | undefined

    constructor() {
        this._length = 0
        this._free = undefined
        this._first = undefined
        this._last = undefined
    }

    length(): number {
        return this._length
    }

    first(): LinkedListEntry<T> | undefined {
        return this._first
    }

    last(): LinkedListEntry<T> | undefined {
        return this._last
    }

    next(entry?: LinkedListEntry<T>): LinkedListEntry<T> | undefined {
        if (entry === undefined) {
            return this._first
        }
        return entry.next
    }

    prev(entry?: LinkedListEntry<T>): LinkedListEntry<T> | undefined {
        if (entry === undefined) {
            return this._last
        }
        return entry.prev
    }

    private allocate(object: T): LinkedListEntry<T> {
        let entry: LinkedListEntry<T>
        if (this._free !== undefined) {
            entry = this._free
            entry.item = object
            entry.next = undefined
            entry.prev = undefined
            this._free = entry.next
        } else {
            entry = {
                item: object,
                next: undefined,
                prev: undefined
            }
        }
        return entry
    }

    add(object: T): void {
        const entry = this.allocate(object)
        if (this._first !== undefined) {
            this._first.prev = entry
        } else {
            this._last = entry
        }
        entry.next = this._first
        this._first = entry
        this._length += 1
    }

    sortedAdd(object: T, sort: (a: T, b: T) => number): void {
        const entry = this.allocate(object)
        this._length += 1
        if (this._first === undefined) {
            this._first = entry
            this._last = entry
            return
        }
        let current: LinkedListEntry<T> | undefined = this._first
        let previous = undefined
        while (current !== undefined) {
            if (sort(entry.item, current.item) <= 0) {
                entry.next = current
                entry.prev = previous
                current.prev = entry
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
        entry.prev = previous
        this._last = entry
    }

    remove(object: T): void {
        let entry = this._first
        while (entry !== undefined) {
            if (entry.item === object) {
                if (entry.prev === undefined) {
                    this._first = entry.next
                    if (entry.next !== undefined) {
                        entry.next.prev = undefined
                    }
                } else {
                    entry.prev.next = entry.next
                    if (entry.next !== undefined) {
                        entry.next.prev = entry.prev
                    }
                }
                if (entry === this._last) {
                    this._last = entry.prev
                }
                entry.next = this._free
                this._free = entry
                this._length -= 1
                return
            }
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
        this._last = undefined
        this._length = 0
    }
}
