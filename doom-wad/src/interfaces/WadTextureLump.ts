import { WadLump } from './WadLump'

export interface WadMapPatch {
    originx: number
    originy: number
    patch: number
    stepdir: number // unused
    colormap: number // unused
}

export interface WadMapTexture {
    name: string
    masked: boolean // used for ?
    width: number
    height: number
    columndirectory: number // unused
    patches: WadMapPatch[]
}

export interface WadTextureLump extends WadLump {
    maptextures: WadMapTexture[]
}
