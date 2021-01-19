jest.mock('../lumps')
import * as lumps from '../lumps'
import { buildWad } from '../../test/buildWad'
import { readWad } from './readWad'
import { WadDirectoryEntry } from '../interfaces/WadDirectory'
import { Wad } from '../interfaces/Wad'
import { WadPlayPalLump } from '../interfaces/WadPlayPalLump'

describe('readWad', () => {
    let readLump: jest.SpyInstance<void, [Buffer, Partial<Wad>, WadDirectoryEntry]>

    beforeEach(() => {
        readLump = jest.spyOn(lumps, 'readLump')
    })

    it('throws if no playpal lump is found', () => {
        const wad = buildWad([])
        expect(() => readWad(wad)).toThrow('No playpal lump found')
    })

    it('returns the resulting wad', () => {
        const wad = buildWad([{ name: 'PLAYPAL', filepos: 0, size: 0 }])

        const expected = {} as WadPlayPalLump
        readLump.mockImplementation((_, wad) => (wad.playpal = expected))

        const actual = readWad(wad)

        expect(actual.playpal).toEqual(expected)
    })
})
