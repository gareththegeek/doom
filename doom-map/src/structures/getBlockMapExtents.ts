import { MapBlockMap } from '..'
import { BLOCK_SIZE } from '../interfaces/MapBlockMap'

export interface BlockMapExtents {
    left: number
    right: number
    top: number
    bottom: number
}

export const getBlockMapExtents = (extents: BlockMapExtents, blockMap: MapBlockMap): void => {
    extents.left = blockMap.origin[0]
    extents.top = blockMap.origin[1]
    extents.right = blockMap.origin[0] + blockMap.blocks.length * BLOCK_SIZE
    extents.bottom = blockMap.origin[1] + blockMap.blocks[0].length * BLOCK_SIZE
}
