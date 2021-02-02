import * as path from 'path'
import Jimp from 'jimp'
import { WadLookup } from 'doom-wad/dist/interfaces/Wad'
import { WadColorMap } from 'doom-wad/dist/interfaces/WadColorMapLump'
import { WadPictureLump } from 'doom-wad/dist/interfaces/WadPictureLump'
import { WadPalette } from 'doom-wad/dist/interfaces/WadPlayPalLump'

const writePicture = async (
    filename: string,
    picture: WadPictureLump,
    colormap: WadColorMap,
    palette: WadPalette
): Promise<void> =>
    new Promise((resolve, reject) => {
        const { width, height } = picture
        const image = new Jimp(width, height)
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const colourIndex = picture.pixels[x][y]
                const colour =
                        [...palette.colours[colormap.indices[colourIndex[0]]], colourIndex[1]]
                const hex = Jimp.rgbaToInt(colour[0], colour[1], colour[2], colour[3])
                image.setPixelColour(hex, x, y)
            }
        }
        image.write(filename, (err) => {
            if (err) {
                reject(err)
            }
            resolve()
        })
    })

export const writePictureLumps = async (
    filepath: string,
    patches: WadLookup<WadPictureLump>,
    colormap: WadColorMap,
    palette: WadPalette
): Promise<void> => {
    const promises = Object.entries(patches).map(([name, picture]) => {
        const filename = path.join(filepath, `${name}.png`)
        return writePicture(filename, picture, colormap, palette)
    })
    await Promise.all(promises)
}
