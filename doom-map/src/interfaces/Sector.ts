import { Geometry } from 'doom-video'
import { Side } from './Side'
import { Thing } from './Thing'

export interface Sector {
    index: number
    floorHeight: number
    ceilingHeight: number
    floorTexture: string
    ceilingTexture: string
    lightLevel: number
    geometry: Geometry | undefined
    things: Thing[]
    sides: Side[]
    tag: number
}
