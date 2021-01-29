import { WadBlockMapLump } from 'doom-wad/dist/interfaces/WadBlockmapLump'
import { BlockMap, BLOCK_SIZE } from '../interfaces/BlockMap'
import { Line } from '../interfaces/Line'

export const createBlockMap = (wadBlockMap: WadBlockMapLump, lines: Line[]): BlockMap => ({
    origin: [wadBlockMap.xorigin, -wadBlockMap.yorigin],
    blocks: wadBlockMap.blocks.map((row, x) =>
        row.map(({ linedefs }, y) => ({
            origin: [wadBlockMap.xorigin + x * BLOCK_SIZE, -(wadBlockMap.yorigin + y * BLOCK_SIZE)],
            lines: linedefs.map((linedef) => lines[linedef]),
            things: []
        }))
    )
})
