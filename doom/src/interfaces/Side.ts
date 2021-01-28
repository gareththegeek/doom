import { WadLineDefFlags } from 'doom-wad/dist/interfaces/WadLineDefsLump'
import { vec2 } from 'gl-matrix'
import { Sector } from './Sector'

export interface Side {
    index: number
    lineIndex: number
    sector: Sector
    other: Side | undefined
    start: vec2
    end: vec2
    flags: WadLineDefFlags
}
