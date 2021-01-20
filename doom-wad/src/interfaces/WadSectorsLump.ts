import { WadLump } from './WadLump'

export interface WadSector {
    floorHeight: number,
    ceilingHeight: number,
    floorTexture: string,
    ceilingTexture: string,
    lightLevel: number,
    specialType: number,
    tag: number
}

export interface WadSectorsLump extends WadLump {
    sectors: WadSector[]
}
