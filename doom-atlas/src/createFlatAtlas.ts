import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { WadFlatLump } from 'doom-wad/dist/interfaces/WadFlatLump'
import { IndexedPixel } from 'doom-wad/dist/interfaces/WadPictureLump'
import { allocateImage } from './allocateImage'
import { AtlasEntry } from './AtlasEntry'
import { packEntries } from './packEntries'
import { TextureAtlas } from './TextureAtlas'

const FLAT_SIZE = 64

const blitFlat = (image: IndexedPixel[][], flat: WadFlatLump, originx: number, originy: number): void => {
    for (let x = 0; x < FLAT_SIZE; x++) {
        image[x + originx].splice(originy, FLAT_SIZE, ...flat.pixels[x])
    }
}

export const createFlatAtlas = (wad: Wad, size: number): TextureAtlas => {
    const image = allocateImage(size)
    const blit = (flat: AtlasEntry<WadFlatLump>, x: number, y: number): void => blitFlat(image, flat.data, x, y)

    const entries = Object.entries(wad.flats).map(([name, flat]) => ({
        width: FLAT_SIZE,
        height: FLAT_SIZE,
        name,
        data: flat
    }))

    return {
        image,
        lookup: packEntries(size, entries, blit)
    }
}
