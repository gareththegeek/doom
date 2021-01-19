import { WadLump } from './WadLump'

export type WadColour = [red: number, green: number, blue: number]

export interface WadPalette {
    colours: WadColour[]
}

export interface WadPlayPalLump extends WadLump {
    palettes: WadPalette[]
}
