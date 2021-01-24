import { TextureAtlasEntry } from '../interfaces/TextureAtlas'

export const buildLookupEntry = (
    size: number,
    x: number,
    y: number,
    width: number,
    height: number
): TextureAtlasEntry => ({
    left: x / size,
    top: y / size,
    right: (x + width) / size,
    bottom: (y + height) / size,
    pixelWidth: width,
    pixelHeight: height
})
