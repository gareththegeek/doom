import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { WadPictureLump, IndexedPixel } from 'doom-wad/dist/interfaces/WadPictureLump'
import { WadMapTexture } from 'doom-wad/dist/interfaces/WadTextureLump'
import { pathToFileURL } from 'url'

const insideTexture = (x: number, y: number, constraints?: TextureConstraints): boolean =>
    !constraints || (x >= constraints.left && y >= constraints.top && x < constraints.right && y < constraints.bottom)

export const blitPatch = (
    image: number[],
    size: number,
    patch: WadPictureLump,
    originx: number,
    originy: number,
    constraints?: TextureConstraints
): void => {
    const { width, height } = patch
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const fx = originx + x
            const fy = originy + y
            if (!insideTexture(fx, fy, constraints)) {
                continue
            }
            const index = (fx * size + fy) * 2
            const transparent = patch.pixels[x][y][1] < 255
            if (transparent && image[index + 0] !== 0) {
                continue
            }
            image[index + 0] = patch.pixels[x][y][0]
            image[index + 1] = patch.pixels[x][y][1]
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

export const blitTexture = (
    { pnames, patches }: Wad,
    image: number[],
    size: number,
    texture: WadMapTexture,
    x: number,
    y: number
): void => {
    const constraints = getTextureContraints(texture, x, y)
    texture.patches.forEach((patchInfo) => {
        const { originx, originy } = patchInfo
        const patchName = pnames.names[patchInfo.patch]
        const patch = patches[patchName]
        blitPatch(image, size, patch, x + originx, y + originy, constraints)
    })
}
