import { Geometry } from 'doom-video'
import { vec3 } from 'gl-matrix'
import { Block } from './BlockMap'
import { Sector } from './Sector'

export interface Thing {
    index: number
    type: number
    spawnPosition: vec3
    spawnAngle: number
    geometry?: Geometry
    sector: Sector
    block: Block
}
