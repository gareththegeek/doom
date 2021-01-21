import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { WadMapTexture } from 'doom-wad/dist/interfaces/WadTextureLump'
import { blitTexture } from './blitTexture'
import { TextureAtlas, TextureAtlasLookup } from './TextureAtlas'

const sortTextures = (a: WadMapTexture, b: WadMapTexture): number => {
    const h = b.height - a.height
    if (h !== 0) {
        return h
    }
    return b.width - a.width
}

const buildLookupEntry = (size: number, texture: WadMapTexture, x: number, y: number) => ({
    left: x / size,
    top: y / size,
    right: (x + texture.width) / size,
    bottom: (y + texture.height) / size
})

export const createAtlas = (wad: Wad, size: number): TextureAtlas => {
    const image = new Array(size).fill([])
    image.forEach((_, i) => (image[i] = new Array(size).fill(undefined)))
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
        if (x + width >= size) {
            x = 0
            y += rowHeight
            rowHeight = height
        }
        lookup[texture.name] = buildLookupEntry(size, texture, x, y)
        blitTexture(wad, image, texture, x, y)
        x += width
    }

    return {
        image,
        lookup
    }
}
