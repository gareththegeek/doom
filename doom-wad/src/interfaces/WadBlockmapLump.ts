import { WadLump } from './WadLump'

export interface WadBlock {
    linedefs: number[]
}

export interface WadBlockMapLump extends WadLump {
    xorigin: number
    yorigin: number
    blocks: WadBlock[][]
}
