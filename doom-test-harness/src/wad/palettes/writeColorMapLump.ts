import Jimp from 'jimp'
import { WadColorMapLump } from 'doom-wad/dist/interfaces/WadColorMapLump'
import { WadPalette } from 'doom-wad/dist/interfaces/WadPlayPalLump'

const WIDTH = 16
const COLOR_MAP_SIZE = 256

export const writeColorMapLump = async (
    filename: string,
    colormapLump: WadColorMapLump,
    palette: WadPalette
): Promise<void> =>
    new Promise((resolve, reject) => {
        const image = new Jimp(WIDTH, (colormapLump.maps.length * COLOR_MAP_SIZE) / WIDTH)
        colormapLump.maps.forEach((map, i) => {
            map.indices.forEach((index, j) => {
                const colour = palette.colours[index]
                const hex = Jimp.rgbaToInt(colour[0], colour[1], colour[2], 0xff)
                const k = i * COLOR_MAP_SIZE + j
                image.setPixelColour(hex, k % 16, Math.floor(k / 16))
            })
        })
        image.write(filename, (err) => {
            if (err) {
                reject(err)
            }
            resolve()
        })
    })
