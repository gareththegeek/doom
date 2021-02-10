import { BufferSetParams, Geometry } from 'doom-video'
import { MapSide } from './MapSide'
import { SectorGeometryData } from './SectorGeometryData'

export interface MapSector {
    index: number
    floorHeight: number
    ceilingHeight: number
    floorTexture: string
    ceilingTexture: string
    lightLevel: number
    geometryParams: BufferSetParams
    geometryData: SectorGeometryData
    geometry: Geometry | undefined
    dirty: boolean
    sides: MapSide[]
    tag: number
}
