import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { IndexedPixel, WadPictureLump } from 'doom-wad/dist/interfaces/WadPictureLump'
import { allocateImage } from './allocateImage'
import { blitPatch } from './blitTexture'
import { buildLookupEntry } from './buildLookupEntry'
import { sortTextures } from './sortTextures'
import { TextureAtlas, TextureAtlasLookup } from './TextureAtlas'

export const createSpriteAtlas = (wad: Wad, size: number): TextureAtlas => {
    const image = allocateImage(size)
    const sortedSprites = Object.entries(wad.sprites)
        .sort(([_, spritea], [__, spriteb]) => sortTextures(spritea, spriteb))
        .map(([name, _]) => name)

    let x = 0
    let y = 0
    let rowHeight = wad.sprites[sortedSprites[0]].height
    const lookup: TextureAtlasLookup = {}
    for (const spriteName of sortedSprites) {
        const sprite = wad.sprites[spriteName]
        const { width, height } = sprite
        if (x + width > size) {
            x = 0
            y += rowHeight
            rowHeight = height
        }
        lookup[spriteName] = buildLookupEntry(size, x, y, width, height)
        blitPatch(sprite, image, x, y)
        x += width
    }

    return {
        image,
        lookup
    }
}
