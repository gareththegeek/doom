import { Geometry } from 'doom-video/dist/scene/Geometry'
import { Side } from './Side'
import { Thing } from './Thing'

export interface Sector {
    index: number
    floorHeight: number
    ceilingHeight: number
    lightLevel: number
    geometry: Geometry
    things: Thing[]
    sides: Side[]
    tag: number
}
