import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { TextureAtlas } from './TextureAtlas'
import Jimp from 'jimp'

export const writeAtlas = async ({ playpal, colormap }: Wad, atlas: TextureAtlas, filename: string): Promise<void> =>
    new Promise((resolve, reject) => {
        const width = atlas.image.length
        const height = atlas.image[0].length
        const image = new Jimp(width, height)
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const colourIndex = atlas.image[x][y]
                if (colourIndex === undefined) {
                    continue
                }
                const colour = playpal.palettes[0].colours[colormap.maps[0].indices[colourIndex]]
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
