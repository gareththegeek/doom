import * as path from 'path'
import Jimp from 'jimp'
import { WadColorMap } from 'doom-wad/dist/interfaces/WadColorMapLump'
import { WadPalette } from 'doom-wad/dist/interfaces/WadPlayPalLump'
import { WadFlatLump } from 'doom-wad/dist/interfaces/WadFlatLump'
import { WadLookup } from 'doom-wad/dist/interfaces/Wad'
const FLAT_WIDTH = 64
const FLAT_HEIGHT = 64

const writeFlat = async (
    filename: string,
    flat: WadFlatLump,
    colormap: WadColorMap,
    palette: WadPalette
): Promise<void> =>
    new Promise((resolve, reject) => {
        const image = new Jimp(FLAT_WIDTH, FLAT_HEIGHT)
        for (let y = 0; y < FLAT_HEIGHT; y++) {
            for (let x = 0; x < FLAT_WIDTH; x++) {
                const colourIndex = flat.pixels[x][y]
                const colour = palette.colours[colormap.indices[colourIndex]]
                const hex = Jimp.rgbaToInt(colour[0], colour[1], colour[2], 0xff)
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

export const writeFlatLumps = async (
    filepath: string,
    flats: WadLookup<WadFlatLump>,
    colormap: WadColorMap,
    palette: WadPalette
): Promise<void> => {
    const promises = Object.entries(flats).map(([name, flat]) => {
        const filename = path.join(filepath, `${name}.png`)
        return writeFlat(filename, flat, colormap, palette)
    })
    await Promise.all(promises)
}
