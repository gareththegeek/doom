import { WadLineDefFlags } from 'doom-wad/dist/interfaces/WadLineDefsLump'
import { vec2 } from 'gl-matrix'
import { MapLine } from './MapLine'
import { MapSector } from './MapSector'

export interface MapSide {
    index: number
    lineIndex: number
    lowerTexture: string
    middleTexture: string
    upperTexture: string
    xoffset: number
    yoffset: number
    line: MapLine
    sector: MapSector
    other: MapSide | undefined
    start: vec2
    end: vec2
    flags: WadLineDefFlags
}
