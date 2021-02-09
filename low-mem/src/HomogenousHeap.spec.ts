import { HomogenousHeap } from '.'

describe('Homogenous Heap', () => {
    it('constructs new objects using constructor', () => {
        const expected = { foo: 'bar' }
        const constructor = () => expected
        const heap = new HomogenousHeap(constructor)
        const actual = heap.allocate()
        expect(actual).toBe(expected)
    })

    it('correctly reuses objects, using constructor when no free objects are available', () => {
        let i = 0
        const constructor = () => ({ foo: i++ })
        const heap = new HomogenousHeap(constructor)
        const a = heap.allocate()
        const b = heap.allocate()
        heap.free(a)
        const c = heap.allocate()
        const d = heap.allocate()
        const e = heap.allocate()

        expect(a.foo).toBe(0)
        expect(b.foo).toBe(1)
        expect(c.foo).toBe(0)
        expect(d.foo).toBe(2)
        expect(e.foo).toBe(3)
    })

    it('correctly handles being emptied', () => {
        let count = 0
        const constructor = () => ({ foo: count++ })
        const heap = new HomogenousHeap(constructor)

        const a = heap.allocate()
        heap.free(a)

        const b = heap.allocate()
        const c = heap.allocate()
        const d = heap.allocate()
        heap.free(b)
        heap.free(c)
        heap.free(d)

        const e = heap.allocate()
        const f = heap.allocate()
        const g = heap.allocate()
        const h = heap.allocate()
        const i = heap.allocate()
        const j = heap.allocate()

        expect(a.foo).toBe(0)
        
        expect(b.foo).toBe(0)
        expect(c.foo).toBe(1)
        expect(d.foo).toBe(2)
        
        expect(e.foo).toBe(2)
        expect(f.foo).toBe(1)
        expect(g.foo).toBe(0)
        expect(h.foo).toBe(3)
        expect(i.foo).toBe(4)
        expect(j.foo).toBe(5)
    })
})
