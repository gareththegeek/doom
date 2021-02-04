import { WadLineDef } from 'doom-wad/dist/interfaces/WadLineDefsLump'
import { WadMapLump } from 'doom-wad/dist/interfaces/WadMapLump'
import { WadSideDef } from 'doom-wad/dist/interfaces/WadSideDefsLump'
import { vec2 } from 'gl-matrix'
import { MapLine } from '../interfaces/MapLine'
import { MapSector } from '../interfaces/MapSector'
import { MapSide } from '../interfaces/MapSide'

const linkSideToSector = (
    sectors: MapSector[],
    linedef: WadLineDef,
    lineIndex: number,
    start: vec2,
    end: vec2,
    wadSide: WadSideDef,
    wadOtherSide: WadSideDef | undefined
): { front: MapSide; back: MapSide | undefined } => {
    const sector = sectors[wadSide.sector]
    const side: MapSide = {
        index: linedef.front,
        lineIndex,
        lowerTexture: wadSide.lowerTexture,
        middleTexture: wadSide.middleTexture,
        upperTexture: wadSide.upperTexture,
        xoffset: wadSide.xoffset,
        yoffset: wadSide.yoffset,
        start,
        end,
        sector,
        flags: linedef.flags,
        other: undefined
    } as MapSide

    sector.sides.push(side)
    let other: MapSide | undefined = undefined
    if (wadOtherSide) {
        const otherSector = sectors[wadOtherSide.sector]
        other = {
            index: linedef.back,
            lineIndex,
            lowerTexture: wadOtherSide.lowerTexture,
            middleTexture: wadOtherSide.middleTexture,
            upperTexture: wadOtherSide.upperTexture,
            xoffset: wadOtherSide.xoffset,
            yoffset: wadOtherSide.yoffset,
            start: end,
            end: start,
            sector: otherSector,
            flags: linedef.flags,
            other: side
        } as MapSide
        side.other = other
        otherSector.sides.push(other)
    }
    return { front: side, back: other }
}

export const createLines = (wadMap: WadMapLump, sectors: MapSector[]): MapLine[] =>
    wadMap.linedefs.map((linedef, index) => {
        const wfront = wadMap.sidedefs[linedef.front]
        const wback = linedef.back > -1 ? wadMap.sidedefs[linedef.back] : undefined
        const vstart = wadMap.vertices[linedef.start]
        const vend = wadMap.vertices[linedef.end]
        const start: vec2 = [vstart.x, -vstart.y]
        const end: vec2 = [vend.x, -vend.y]
        const { front, back } = linkSideToSector(sectors, linedef, index, start, end, wfront, wback)
        const line = {
            index,
            front,
            back,
            startIndex: linedef.start,
            endIndex: linedef.end,
            start,
            end,
            flags: linedef.flags,
            special: linedef.specialType,
            sectorTag: linedef.sectorTag
        }
        front.line = line
        if (back !== undefined) {
            back.line = line
        }
        return line
    })
