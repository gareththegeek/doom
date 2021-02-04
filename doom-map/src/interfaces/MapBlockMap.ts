import { vec2 } from 'gl-matrix'
import { MapLine } from './MapLine'

export const BLOCK_SIZE = 128

export interface MapBlock {
    origin: vec2
    lines: MapLine[]
}

export interface MapBlockMap {
    origin: vec2
    blocks: MapBlock[][]
}
