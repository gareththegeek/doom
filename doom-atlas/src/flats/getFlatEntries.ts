import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { WadFlatLump } from 'doom-wad/dist/interfaces/WadFlatLump'
import { AtlasEntry } from '../interfaces/AtlasEntry'

const FLAT_SIZE = 64

const blitFlat = (image: number[], size: number, flat: WadFlatLump, originx: number, originy: number): void => {
    for (let x = 0; x < FLAT_SIZE; x++) {
        const idx = ((x + originx) * size + originy) * 2
        image.splice(idx, FLAT_SIZE * 2, ...flat.pixels[x].map((pixel) => [pixel, 255]).flat())
    }
}

export const getFlatEntries = (image: number[], size: number, wad: Wad): AtlasEntry<WadFlatLump>[] =>
    Object.entries(wad.flats).map(([name, flat]) => ({
        width: FLAT_SIZE,
        height: FLAT_SIZE,
        name,
        data: flat,
        blit: (flat: AtlasEntry<WadFlatLump>, x: number, y: number): void => blitFlat(image, size, flat.data, x, y)
    }))
