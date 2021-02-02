import { Geometry } from 'doom-video'
import { Side } from './Side'
import { Thing } from './Thing'

export interface SectorUpdate {
    cancel: boolean
    function: SectorUpdateFunction
}
export type SectorUpdateFunction = (deltaTime: number) => void

export interface Sector {
    index: number
    floorHeight: number
    ceilingHeight: number
    floorTexture: string
    ceilingTexture: string
    lightLevel: number
    update?: SectorUpdate
    geometry: Geometry | undefined
    dirty: boolean
    things: Thing[]
    sides: Side[]
    tag: number
}
