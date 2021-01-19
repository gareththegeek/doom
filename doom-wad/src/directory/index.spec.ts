import { buildWad } from '../../test/buildWad'
import { WadDirectoryEntry, WAD_DIRECTORY_ENTRY_SIZE } from '../interfaces/WadDirectory'
import { readDirectory } from './readDirectory'

describe('readDirectory', () => {
    it('reads the identification from the wad', () => {
        const expected = 'IWAD'

        const wad = Buffer.alloc(12)
        wad.write(expected, 'ascii')
        wad.writeInt32LE(0, 4)
        wad.writeInt32LE(0, 8)

        const actual = readDirectory(wad)

        expect(actual.identification).toEqual(expected)
    })

    it('throws if identification is invalid', () => {
        const expected = 'NWAD'

        const wad = Buffer.alloc(12)
        wad.write(expected, 'ascii')
        wad.writeInt32LE(0, 4)
        wad.writeInt32LE(0, 8)

        expect(() => readDirectory(wad)).toThrow("Unsupported file format 'NWAD'")
    })

    it('reads directory entries from wad', () => {
        const expected = [
            { filepos: 34, size: 12, name: 'JOHN\u0000\u0000\u0000\u0000' },
            { filepos: 123, size: 0, name: 'E1M1\u0000\u0000\u0000\u0000' }
        ]

        const wad = buildWad(expected)
        const actual = readDirectory(wad)

        expect(actual.entries.length).toEqual(expected.length)
        expect(actual.entries[0]).toEqual({ ...expected[0], name: 'JOHN' })
        expect(actual.entries[1]).toEqual({ ...expected[1], name: 'E1M1' })
    })

    it('sorts entries by filepos', () => {
        const expected = [
            { filepos: 123, size: 0, name: 'X' },
            { filepos: 34, size: 0, name: 'X' },
            { filepos: 2, size: 0, name: 'X' },
            { filepos: 54, size: 0, name: 'X' },
            { filepos: 98, size: 0, name: 'X' }
        ]

        const wad = buildWad(expected)
        const actual = readDirectory(wad)

        expect(actual.entries.length).toEqual(expected.length)
        expect(actual.entries[0].filepos).toEqual(2)
        expect(actual.entries[1].filepos).toEqual(34)
        expect(actual.entries[2].filepos).toEqual(54)
        expect(actual.entries[3].filepos).toEqual(98)
        expect(actual.entries[4].filepos).toEqual(123)
    })
})
