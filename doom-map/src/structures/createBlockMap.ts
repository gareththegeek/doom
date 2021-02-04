import { WadBlockMapLump } from 'doom-wad/dist/interfaces/WadBlockmapLump'
import { MapBlockMap, BLOCK_SIZE } from '../interfaces/MapBlockMap'
import { MapLine } from '../interfaces/MapLine'

export const createBlockMap = (wadBlockMap: WadBlockMapLump, lines: MapLine[]): MapBlockMap => ({
    origin: [wadBlockMap.xorigin, -wadBlockMap.yorigin],
    blocks: wadBlockMap.blocks.map((row, x) =>
        row.map(({ linedefs }, y) => ({
            origin: [wadBlockMap.xorigin + x * BLOCK_SIZE, -(wadBlockMap.yorigin + y * BLOCK_SIZE)],
            lines: linedefs.map((linedef) => lines[linedef])
        }))
    )
})
