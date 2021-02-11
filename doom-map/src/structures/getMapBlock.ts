import { ReadonlyVec2, vec2 } from 'gl-matrix'
import { MapBlock, MapBlockMap, BLOCK_SIZE } from 'doom-map/src/interfaces/MapBlockMap'

export const getMapBlockCoordinates = (result: vec2, blockmap: MapBlockMap, point: ReadonlyVec2): void => {
    result[0] = Math.floor((point[0] - blockmap.origin[0]) / BLOCK_SIZE)
    // Because I inverted y coordinates for opengl this is now backwards :/
    // Should have left them as is and reversed the coordinates in the shader
    result[1] = Math.floor((blockmap.origin[1] - point[1]) / BLOCK_SIZE)
}

const pos = vec2.create()

export const getMapBlock = (blockmap: MapBlockMap, point: ReadonlyVec2): MapBlock | undefined => {
    getMapBlockCoordinates(pos, blockmap, point)
    const x = pos[0]
    const y = pos[1]
    if (x < 0 || x >= blockmap.blocks.length || y < 0 || y >= blockmap.blocks[0].length) {
        return undefined
    }
    return blockmap.blocks[x][y]
}
