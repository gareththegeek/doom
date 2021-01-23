import * as path from 'path'
import Jimp from 'jimp'
import { WadLookup } from 'doom-wad/dist/interfaces/Wad'
import { WadColorMap } from 'doom-wad/dist/interfaces/WadColorMapLump'
import { WadPalette } from 'doom-wad/dist/interfaces/WadPlayPalLump'
import { WadMapTexture, WadTextureLump } from 'doom-wad/dist/interfaces/WadTextureLump'
import { WadPictureLump } from 'doom-wad/dist/interfaces/WadPictureLump'

const writePatch = (
    patch: WadPictureLump,
    colormap: WadColorMap,
    palette: WadPalette,
    image: Jimp,
    originx: number,
    originy: number
) => {
    const { width, height } = patch
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const colourIndex = patch.pixels[x][y]
            if (colourIndex === undefined) {
                continue
            }
            const colour = [...palette.colours[colormap.indices[colourIndex]], 0xff]

            const hex = Jimp.rgbaToInt(colour[0], colour[1], colour[2], colour[3])
            image.setPixelColour(hex, originx + x, originy + y)
        }
    }
}

const writeTexture = async (
    filename: string,
    texture: WadMapTexture,
    pnames: string[],
    patches: WadLookup<WadPictureLump>,
    colormap: WadColorMap,
    palette: WadPalette
): Promise<void> =>
    new Promise((resolve, reject) => {
        try {
            const { width, height } = texture
            const image = new Jimp(width, height)

            texture.patches.forEach((patchInfo) => {
                const { originx, originy } = patchInfo
                const patchName = pnames[patchInfo.patch]
                const patch = patches[patchName]
                writePatch(patch, colormap, palette, image, originx, originy)
            })

            image.write(filename, (err) => {
                if (err) {
                    reject(err)
                }
                resolve()
            })
        } catch (e) {
            console.error(e)
            reject(e)
        }
    })

export const writeTextureLumps = async (
    filepath: string,
    pnames: string[],
    textures: WadTextureLump,
    patches: WadLookup<WadPictureLump>,
    colormap: WadColorMap,
    palette: WadPalette
): Promise<void> => {
    const promises = textures.maptextures.map((texture) => {
        const filename = path.join(filepath, `${texture.name}.png`)
        return writeTexture(filename, texture, pnames, patches, colormap, palette)
    })
    await Promise.all(promises)
}
