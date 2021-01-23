import { WadLump } from './WadLump'

export interface WadLineDefFlags {
    blocks: boolean
    blocksMonstersOnly: boolean
    twoSided: boolean
    upperUnpegged: boolean
    lowerUnpegged: boolean
    secret: boolean
    blocksSound: boolean
    noAutomap: boolean
    alwaysAutomap: boolean
}

export interface WadLineDef {
    start: number
    end: number
    flags: WadLineDefFlags
    specialType: number
    sectorTag: number
    front: number
    back: number
}
