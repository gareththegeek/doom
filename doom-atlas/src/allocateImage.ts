import { IndexedPixel } from 'doom-wad/dist/interfaces/WadPictureLump'

export const allocateImage = (size: number): IndexedPixel[][] => {
    const image = new Array(size).fill([])
    image.forEach((_, i) => (image[i] = new Array(size).fill(undefined)))
    return image
}
