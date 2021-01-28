import { WadLineDef } from 'doom-wad/dist/interfaces/WadLineDefsLump'
import { WadMapLump } from 'doom-wad/dist/interfaces/WadMapLump'
import { WadSideDef } from 'doom-wad/dist/interfaces/WadSideDefsLump'
import { WadVertex } from 'doom-wad/dist/interfaces/WadVertexLump'
import { Sector } from '../interfaces/Sector'
import { Side } from '../interfaces/Side'

const linkSideToSector = (
    sectors: Sector[],
    linedef: WadLineDef,
    lineIndex: number,
    start: WadVertex,
    end: WadVertex,
    wadSide: WadSideDef,
    wadOtherSide: WadSideDef | undefined
): void => {
    const sector = sectors[wadSide.sector]
    const side: Side = {
        index: linedef.front,
        lineIndex,
        start: [start.x, -start.y],
        end: [end.x, -end.y],
        sector,
        flags: linedef.flags,
        other: undefined
    }

    sector.sides.push(side)
    if (wadOtherSide) {
        const otherSector = sectors[wadOtherSide.sector]
        const other: Side = {
            index: linedef.back,
            lineIndex,
            start: [end.x, -end.y],
            end: [start.x, -start.y],
            sector: otherSector,
            flags: linedef.flags,
            other: side
        }
        side.other = other
        otherSector.sides.push(other)
    }
}

export const linkSidesToSectors = (wadMap: WadMapLump, sectors: Sector[]): void => {
    wadMap.linedefs.forEach((linedef, index) => {
        const front = wadMap.sidedefs[linedef.front]
        const back = linedef.back > -1 ? wadMap.sidedefs[linedef.back] : undefined
        const start = wadMap.vertices[linedef.start]
        const end = wadMap.vertices[linedef.end]
        linkSideToSector(sectors, linedef, index, start, end, front, back)
    })
}
