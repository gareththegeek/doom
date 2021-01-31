import { WadLineDef } from 'doom-wad/dist/interfaces/WadLineDefsLump'
import { WadMapLump } from 'doom-wad/dist/interfaces/WadMapLump'
import { WadSideDef } from 'doom-wad/dist/interfaces/WadSideDefsLump'
import { vec2 } from 'gl-matrix'
import { Line } from '../interfaces/Line'
import { Sector } from '../interfaces/Sector'
import { Side } from '../interfaces/Side'

const linkSideToSector = (
    sectors: Sector[],
    linedef: WadLineDef,
    lineIndex: number,
    start: vec2,
    end: vec2,
    wadSide: WadSideDef,
    wadOtherSide: WadSideDef | undefined
): { front: Side; back: Side | undefined } => {
    const sector = sectors[wadSide.sector]
    const side: Side = {
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
    } as Side

    sector.sides.push(side)
    let other: Side | undefined = undefined
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
        } as Side
        side.other = other
        otherSector.sides.push(other)
    }
    return { front: side, back: other }
}

export const createLines = (wadMap: WadMapLump, sectors: Sector[]): Line[] =>
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
