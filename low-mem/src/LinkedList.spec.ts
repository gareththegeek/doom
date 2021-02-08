import { LinkedList } from './LinkedList'

describe('LinkedList', () => {
    it('is initially empty', () => {
        const actual = new LinkedList()
        expect(actual.length()).toEqual(0)
    })

    const toArray = <T>(list: LinkedList<T>): T[] => {
        let next = list.next()
        const actual: T[] = []
        while (next !== undefined) {
            actual.push(next.item)
            next = list.next(next)
        }
        return actual
    }

    const checkList = <T>(expected: T[], list: LinkedList<T>): void => {
        expect(list.length()).toEqual(expected.length)

        const actual = toArray(list)

        expect(actual.length).toBe(expected.length)
        expected.forEach((expectedItem) => expect(actual.includes(expectedItem)).toBe(true))
    }

    it('stores items that are inserted', () => {
        const expected = [{ foo: 'bar' }, { foo: 'two' }]

        const list = new LinkedList<{ foo: string }>()
        list.add(expected[0])
        list.add(expected[1])

        checkList(expected, list)
    })

    it('removes the correct item', () => {
        const expected = [{ foo: 'bar' }, { foo: 'two' }]
        const unexpected = { foo: 'noooo' }

        const list = new LinkedList()
        list.add(expected[0])
        list.add(unexpected)
        list.add(expected[1])

        list.remove(unexpected)

        checkList(expected, list)
    })

    it('handles addition of new items after items are removed', () => {
        const expected = [{ foo: 'bar' }, { foo: 'two' }, { foo: 'another' }]
        const unexpected = [{ foo: 'noooo' }, { foo: 'bad' }]

        const list = new LinkedList()
        list.add(expected[0])
        list.add(unexpected[0])
        list.add(expected[1])
        list.add(unexpected[1])
        list.remove(unexpected[0])
        list.add(expected[2])
        list.remove(unexpected[1])

        checkList(expected, list)
    })

    it('handles removal of first item', () => {
        const expected = [{ foo: 'bar' }, { foo: 'two' }]
        const unexpected = [{ foo: 'noooo' }]

        const list = new LinkedList()
        list.add(unexpected[0])
        list.add(expected[0])
        list.remove(unexpected[0])
        list.add(expected[1])

        checkList(expected, list)
    })

    it('correctly ignores requests to remove non-existant items', () => {
        const expected = [{ foo: 'bar' }, { foo: 'two' }]
        const unexpected = { foo: 'noooo' }

        const list = new LinkedList()
        list.add(expected[0])
        list.remove(unexpected)
        list.add(expected[1])

        checkList(expected, list)
    })

    it('correctly clears all entries', () => {
        const expected = [{ foo: 'bar' }, { foo: 'two' }]
        const unexpected = [{ foo: 'noooo' }, { foo: 'bad' }]

        const list = new LinkedList()
        list.add(unexpected[0])
        list.add(unexpected[1])
        list.clear()
        list.add(expected[0])
        list.add(expected[1])

        checkList(expected, list)
    })

    interface TestObject {
        foo: number
    }
    const sort = (a: TestObject, b: TestObject) => a.foo - b.foo

    const sortedCheckList = <T>(expected: T[], list: LinkedList<T>): void => {
        expect(list.length()).toEqual(expected.length)

        const actual = toArray(list)

        expect(actual.length).toBe(expected.length)
        expect(actual).toEqual(expected)
    }

    it('inserts first item when adding sorted', () => {
        const expected = [{ foo: 2 }]

        const list = new LinkedList<TestObject>()
        list.sortedAdd(expected[0], sort)

        sortedCheckList(expected, list)
    })

    it('inserts and sorts several items', () => {
        const expected = [{ foo: 2 }, { foo: 5 }, { foo: 7 }, { foo: 16 }, { foo: 16 }, { foo: 123 }]

        const list = new LinkedList<TestObject>()
        list.sortedAdd(expected[4], sort)
        list.sortedAdd(expected[0], sort)
        list.sortedAdd(expected[5], sort)
        list.sortedAdd(expected[2], sort)
        list.sortedAdd(expected[3], sort)
        list.sortedAdd(expected[1], sort)

        sortedCheckList(expected, list)
    })

    it('sorted add can handle removals', () => {
        const expected = [{ foo: 2 }, { foo: 5 }, { foo: 7 }, { foo: 16 }, { foo: 16 }, { foo: 123 }]
        const unexpected = { foo: -1 }

        const list = new LinkedList<TestObject>()
        list.sortedAdd(expected[4], sort)
        list.sortedAdd(expected[0], sort)
        list.sortedAdd(unexpected, sort)
        list.sortedAdd(expected[5], sort)
        list.remove(unexpected)
        list.sortedAdd(expected[2], sort)
        list.sortedAdd(expected[3], sort)
        list.sortedAdd(expected[1], sort)

        sortedCheckList(expected, list)
    })
})
