import { WadLineDefFlags } from 'doom-wad/dist/interfaces/WadLineDefsLump'
import { vec2 } from 'gl-matrix'
import { Side } from './Side'

export interface Line {
    index: number
    front: Side
    back: Side | undefined
    startIndex: number
    endIndex: number
    start: vec2
    end: vec2
    flags: WadLineDefFlags
    special: number
    sectorTag: number
}
