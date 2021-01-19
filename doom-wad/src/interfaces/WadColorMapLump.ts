import { WadLump } from './WadLump'

export interface WadColorMap {
    indices: number[]
}

export interface WadColorMapLump extends WadLump {
    maps: WadColorMap[]
}
