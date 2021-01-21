import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { IndexedPixel, WadPictureLump } from 'doom-wad/dist/interfaces/WadPictureLump'
import { WadMapTexture } from 'doom-wad/dist/interfaces/WadTextureLump'
import { TextureAtlas } from './TextureAtlas'

const sortTextures = (a: WadMapTexture, b: WadMapTexture): number => {
    const h = b.height - a.height
    if (h !== 0) {
        return h
    }
    return b.width - a.width
}

const blitPatch = (
    patch: WadPictureLump,
    image: IndexedPixel[][],
    originx: number,
    originy: number,
    constraints: TextureConstraints
): void => {
    const { width, height } = patch
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const fx = originx + x
            const fy = originy + y
            if (fx < constraints.left || fy < constraints.top || fx >= constraints.right || fy >= constraints.bottom) {
                continue
            }
            const colourIndex = patch.pixels[x][y]
            if (colourIndex === undefined) {
                continue
            }
            image[originx + x][originy + y] = colourIndex
        }
    }
}

interface TextureConstraints {
    left: number
    right: number
    bottom: number
    top: number
}

const getTextureContraints = (texture: WadMapTexture, x: number, y: number): TextureConstraints => ({
    left: x,
    right: x + texture.width,
    top: y,
    bottom: y + texture.height
})

const blitTexture = (
    { pnames, patches }: Wad,
    image: IndexedPixel[][],
    texture: WadMapTexture,
    x: number,
    y: number
): void => {
    const constraints = getTextureContraints(texture, x, y)
    texture.patches.forEach((patchInfo) => {
        const { originx, originy } = patchInfo
        const patchName = pnames.names[patchInfo.patch]
        const patch = patches[patchName]
        blitPatch(patch, image, x + originx, y + originy, constraints)
    })
}

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
    for (const texture of sortedTextures) {
        const { width, height } = texture
        if (x + width >= size) {
            x = 0
            y += rowHeight
            rowHeight = height
        }
        blitTexture(wad, image, texture, x, y)
        x += width
    }

    return {
        image,
        lookup: {}
    }
}
