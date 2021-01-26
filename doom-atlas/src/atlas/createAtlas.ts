import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { getFlatEntries } from '../flats'
import { packEntries, allocateImage } from '../packing'
import { getSpriteEntries } from '../sprites'
import { getTextureEntries } from '../textures'

export const createAtlas = (wad: Wad, size: number) => {
    const image = allocateImage(size)
    const entries = [
        ...getTextureEntries(image, size, wad),
        ...getSpriteEntries(image, size, wad),
        ...getFlatEntries(image, size, wad)
    ]
    return {
        image,
        lookup: packEntries<any>(image, size, entries)
    }
}
