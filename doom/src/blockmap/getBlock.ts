import { vec2 } from 'gl-matrix'
import { Block, BlockMap, BLOCK_SIZE } from '../interfaces/BlockMap'

export const getBlock = (blockmap: BlockMap, point: vec2): Block => {
    const x = Math.floor((point[0] - blockmap.origin[0]) / BLOCK_SIZE)
    const y = Math.floor((point[1] - blockmap.origin[1]) / BLOCK_SIZE)
    return blockmap.blocks[x][y]
}
