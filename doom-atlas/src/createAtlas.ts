import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { allocateImage } from './allocateImage'
import { getFlatEntries } from './flats'
import { packEntries } from './packEntries'
import { getSpriteEntries } from './sprites'
import { getTextureEntries } from './textures'

export const createAtlas = (wad: Wad, size: number) => {
    const image = allocateImage(size)
    const entries = [...getTextureEntries(image, wad), ...getSpriteEntries(image, wad), ...getFlatEntries(image, wad)]
    return {
        image,
        lookup: packEntries<any>(size, entries)
    }
}
