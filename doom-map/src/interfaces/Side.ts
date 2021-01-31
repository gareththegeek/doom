import { WadLineDefFlags } from 'doom-wad/dist/interfaces/WadLineDefsLump'
import { vec2 } from 'gl-matrix'
import { Line } from './Line'
import { Sector } from './Sector'

export interface Side {
    index: number
    lineIndex: number
    lowerTexture: string
    middleTexture: string
    upperTexture: string
    xoffset: number
    yoffset: number
    line: Line
    sector: Sector
    other: Side | undefined
    start: vec2
    end: vec2
    flags: WadLineDefFlags
}
