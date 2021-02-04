import { Geometry } from 'doom-video'
import { MapSide } from './MapSide'

export interface MapSector {
    index: number
    floorHeight: number
    ceilingHeight: number
    floorTexture: string
    ceilingTexture: string
    lightLevel: number
    geometry: Geometry | undefined
    dirty: boolean
    sides: MapSide[]
    tag: number
}
