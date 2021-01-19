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

    const writeEntry = (wad: Buffer, offset: number, entry: WadDirectoryEntry): void => {
        wad.writeInt32LE(entry.filepos, offset + 0)
        wad.writeInt32LE(entry.size, offset + 4)
        wad.write(entry.name, offset + 8, 'ascii')
    }

    it('reads directory entries from wad', () => {
        const directoryOffset = 50
        const expected = [
            { filepos: 123, size: 12, name: 'JOHN\u0000\u0000\u0000\u0000' },
            { filepos: 34, size: 0, name: 'E1M1\u0000\u0000\u0000\u0000' }
        ]

        const wad = Buffer.alloc(directoryOffset + 2 * WAD_DIRECTORY_ENTRY_SIZE)
        wad.write('IWAD', 'ascii')
        wad.writeInt32LE(expected.length, 4)
        wad.writeInt32LE(directoryOffset, 8)

        writeEntry(wad, directoryOffset + WAD_DIRECTORY_ENTRY_SIZE * 0, expected[0])
        writeEntry(wad, directoryOffset + WAD_DIRECTORY_ENTRY_SIZE * 1, expected[1])

        const actual = readDirectory(wad)

        expect(actual.entries.length).toEqual(expected.length)
        expect(actual.entries[0]).toEqual({ ...expected[0], name: 'JOHN' })
        expect(actual.entries[1]).toEqual({ ...expected[1], name: 'E1M1' })
    })
})
