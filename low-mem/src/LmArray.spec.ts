import { LmArray } from './LmArray'

describe('LmArray', () => {
    it('is initially empty', () => {
        const actual = new LmArray()
        expect(actual.length()).toEqual(0)
    })

    it('stores items in the order they are inserted', () => {
        const expected = [{ foo: 'bar' }, { foo: 'two' }]

        const array = new LmArray()
        array.add(expected[0])
        array.add(expected[1])

        expect(array.length()).toEqual(2)
        expect(array.get(0)).toBe(expected[0])
        expect(array.get(1)).toBe(expected[1])
    })

    it('removes the correct item', () => {
        const expected = [{ foo: 'bar' }, { foo: 'two' }]
        const unexpected = { foo: 'noooo' }

        const array = new LmArray()
        array.add(expected[0])
        array.add(unexpected)
        array.add(expected[1])

        array.remove(unexpected)

        expect(array.length()).toEqual(2)
        expect(array.get(0)).toBe(expected[0])
        expect(array.get(1)).toBe(expected[1])
    })

    it('handles addition of new items after items are removed', () => {
        const expected = [{ foo: 'bar' }, { foo: 'two' }, { foo: 'another' }]
        const unexpected = [{ foo: 'noooo' }, { foo: 'bad' }]

        const array = new LmArray()
        array.add(expected[0])
        array.add(unexpected[0])
        array.add(expected[1])
        array.add(unexpected[1])
        array.remove(unexpected[0])
        array.add(expected[2])
        array.remove(unexpected[1])

        expect(array.length()).toEqual(3)
        expect(array.get(0)).toBe(expected[0])
        expect(array.get(1)).toBe(expected[1])
        expect(array.get(2)).toBe(expected[2])
    })

    it('returns undefined if non-existant index is requested', () => {
        const array = new LmArray()
        const actual = array.get(123)

        expect(actual).toBeUndefined()
    })

    it('correctly ignores requests to remove non-existant items', () => {
        const expected = [{ foo: 'bar' }, { foo: 'two' }]
        const unexpected = { foo: 'noooo' }

        const array = new LmArray()
        array.add(expected[0])
        array.remove(unexpected)
        array.add(expected[1])

        expect(array.length()).toEqual(2)
        expect(array.get(0)).toBe(expected[0])
        expect(array.get(1)).toBe(expected[1])
    })
})
