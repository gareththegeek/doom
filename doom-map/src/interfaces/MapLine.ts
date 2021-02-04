import { WadLineDefFlags } from 'doom-wad/dist/interfaces/WadLineDefsLump'
import { vec2 } from 'gl-matrix'
import { MapSide } from './MapSide'

export interface MapLine {
    index: number
    front: MapSide
    back: MapSide | undefined
    startIndex: number
    endIndex: number
    start: vec2
    end: vec2
    flags: WadLineDefFlags
    special: number
    sectorTag: number
}
