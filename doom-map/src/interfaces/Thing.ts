import { vec3 } from 'gl-matrix'
import { MapBlock } from './MapBlockMap'
import { MapSector } from './MapSector'

export interface Thing {
    index: number
    type: number
    spawnPosition: vec3
    spawnAngle: number
    sector: MapSector
    block: MapBlock
}
