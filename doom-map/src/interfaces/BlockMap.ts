import { vec2 } from 'gl-matrix'
import { Line } from './Line'
import { Thing } from './Thing'

export const BLOCK_SIZE = 128

export interface Block {
    origin: vec2
    lines: Line[]
    things: Thing[]
}

export interface BlockMap {
    origin: vec2
    blocks: Block[][]
}
