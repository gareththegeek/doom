import { vec2 } from 'gl-matrix'
import { Block, BlockMap, BLOCK_SIZE } from '../interfaces/BlockMap'

export const getBlock = (blockmap: BlockMap, point: vec2): Block => {
    const x = Math.floor((point[0] - blockmap.origin[0]) / BLOCK_SIZE)
    // Because I inverted y coordinates for opengl this is now backwards :/
    // Should have left them as is and reversed the coordinates in the shader
    const y = Math.floor((blockmap.origin[1] - point[1]) / BLOCK_SIZE)
    return blockmap.blocks[x][y]
}
