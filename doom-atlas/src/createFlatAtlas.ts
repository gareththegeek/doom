import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { WadFlatLump } from 'doom-wad/dist/interfaces/WadFlatLump'
import { buildLookupEntry } from './buildLookupEntry'
import { TextureAtlas, TextureAtlasLookup } from './TextureAtlas'

const FLAT_SIZE = 64

const blitFlat = (image: number[][], flat: WadFlatLump, originx: number, originy: number): void => {
    for (let x = 0; x < FLAT_SIZE; x++) {
        image[x + originx].splice(originy, FLAT_SIZE, ...flat.pixels[x])
    }
}

export const createFlatAtlas = (wad: Wad, size: number): TextureAtlas => {
    const image = new Array(size).fill([])
    image.forEach((_, i) => (image[i] = new Array(size).fill(undefined)))

    let x = 0
    let y = 0
    const lookup: TextureAtlasLookup = {}
    for (const [name, flat] of Object.entries(wad.flats)) {
        if (x + FLAT_SIZE > size) {
            x = 0
            y += FLAT_SIZE
        }
        lookup[name] = buildLookupEntry(size, x, y, FLAT_SIZE, FLAT_SIZE)
        blitFlat(image, flat, x, y)
        x += FLAT_SIZE
    }

    return {
        image,
        lookup
    }
}
