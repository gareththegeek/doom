import { WadLump } from './WadLump'

export type IndexedPixel = [index: number, alpha: number]

export interface WadPictureLump extends WadLump {
    width: number
    height: number
    leftoffset: number
    topoffset: number
    pixels: IndexedPixel[][]
}
