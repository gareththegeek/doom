jest.mock('../palettes')
import * as palettes from '../palettes'
import { WadDirectoryEntry } from '../interfaces/WadDirectory'
import { WadPlayPalLump } from '../interfaces/WadPlayPalLump'
import { buildWad } from '../../test/buildWad'
import { readLump } from './readLump'
import { Wad } from '../interfaces/Wad'

describe('readLump', () => {
    let readPlayPalLump: jest.SpyInstance<WadPlayPalLump, [Buffer, WadDirectoryEntry]>

    beforeEach(() => {
        readPlayPalLump = jest.spyOn(palettes, 'readPlayPalLump')
    })

    it('process playpal lump', () => {
        const entry = { name: 'PLAYPAL', filepos: 1, size: 2 }
        const data = buildWad([entry])

        const expected = {} as WadPlayPalLump
        readPlayPalLump.mockReturnValue(expected)

        const wad: Partial<Wad> = {}
        readLump(data, wad, entry)

        expect(wad!.playpal).toEqual(expected)
    })
})
