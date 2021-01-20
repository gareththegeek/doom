import * as path from 'path'
import Jimp from 'jimp'
import { WadLookup } from '../interfaces/Wad'
import { WadColorMap } from '../interfaces/WadColorMapLump'
import { WadPictureLump } from '../interfaces/WadPictureLump'
import { WadPalette } from '../interfaces/WadPlayPalLump'

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
                    colourIndex === undefined
                        ? [0, 0, 0, 0]
                        : [...palette.colours[colormap.indices[colourIndex]], 0xff]
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
