import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { allocateImage } from './allocateImage'
import { blitTexture } from './blitTexture'
import { buildLookupEntry } from './buildLookupEntry'
import { sortTextures } from './sortTextures'
import { TextureAtlas, TextureAtlasLookup } from './TextureAtlas'

export const createTextureAtlas = (wad: Wad, size: number): TextureAtlas => {
    const image = allocateImage(size)
    let allTextures = wad.texture1.maptextures
    if (!!wad.texture2) {
        allTextures = allTextures.concat(wad.texture2.maptextures)
    }
    const sortedTextures = allTextures.sort(sortTextures)

    let x = 0
    let y = 0
    let rowHeight = sortedTextures[0].height
    const lookup: TextureAtlasLookup = {}
    for (const texture of sortedTextures) {
        const { width, height } = texture
        if (x + width > size) {
            x = 0
            y += rowHeight
            rowHeight = height
        }
        lookup[texture.name] = buildLookupEntry(size, x, y, texture.width, texture.height)
        blitTexture(wad, image, texture, x, y)
        x += width
    }

    return {
        image,
        lookup
    }
}
