import * as path from 'path'
import { WadPalette, WadPlayPalLump } from '../interfaces/WadPlayPalLump'
import Jimp from 'jimp'

const writePalette = async (filename: string, palette: WadPalette): Promise<void> =>
    new Promise((resolve, reject) => {
        const image = new Jimp(16, 16)
        palette.colours.forEach((colour, index) => {
            const hex = Jimp.rgbaToInt(colour[0], colour[1], colour[2], 0xff)
            image.setPixelColour(hex, Math.floor(index / 16), index % 16)
        })
        image.write(filename, (err) => {
            if (err) {
                reject(err)
            }
            resolve()
        })
    })

export const writePlayPalLump = async (filepath: string, playpalLump: WadPlayPalLump): Promise<void> => {
    const promises = playpalLump.palettes.map((palette, index) => {
        const filename = path.join(filepath, `${index}.png`)
        return writePalette(filename, palette)
    })
    await Promise.all(promises)
}
