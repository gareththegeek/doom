import { readString } from '.'

describe('readString', () => {
    it('reads a string of the specified offset and length from a buffer', () => {
        const expected = 'I am a string'
        const buffer = Buffer.from(`1234${expected}5678`)
        const actual = readString(buffer, 4, expected.length + 4)
        expect(actual).toEqual(expected.toLowerCase())
    })

    it('removes null characters', () => {
        const expected = '1234'
        const unexpected = '\u0000\u0000'
        const buffer = Buffer.from(`${expected}${unexpected}`)
        const actual = readString(buffer, 0, expected.length + unexpected.length)
        expect(actual).toEqual(expected)
    })
})
