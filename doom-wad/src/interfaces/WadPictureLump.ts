import { WadLump } from './WadLump'

// Undefined pixels are transparent
export type IndexedPixel = (number | undefined)

export interface WadPictureLump extends WadLump {
    width: number
    height: number
    leftoffset: number
    topoffset: number
    pixels: IndexedPixel[][]
}
