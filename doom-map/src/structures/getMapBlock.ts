import { ReadonlyVec2 } from 'gl-matrix'
import { MapBlock, MapBlockMap, BLOCK_SIZE } from 'doom-map/src/interfaces/MapBlockMap'

export const getMapBlock = (blockmap: MapBlockMap, point: ReadonlyVec2): MapBlock | undefined => {
    const x = Math.floor((point[0] - blockmap.origin[0]) / BLOCK_SIZE)
    // Because I inverted y coordinates for opengl this is now backwards :/
    // Should have left them as is and reversed the coordinates in the shader
    const y = Math.floor((blockmap.origin[1] - point[1]) / BLOCK_SIZE)
    if (x < 0 || x >= blockmap.blocks.length || y < 0 || y >= blockmap.blocks[0].length) {
        return undefined
    }
    return blockmap.blocks[x][y]
}
