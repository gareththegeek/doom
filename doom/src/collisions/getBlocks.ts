import { BLOCK_SIZE } from 'doom-map/dist/interfaces/MapBlockMap'
import { ReadonlyVec2, vec2 } from 'gl-matrix'
import { contains, LinkedList } from 'low-mem'
import { Block } from '../interfaces/BlockMap'
import { Physics } from '../interfaces/State'
import { getBlock } from './getBlock'

let allCorners = [
    [vec2.create(), vec2.create(), vec2.create(), vec2.create()],
    [vec2.create(), vec2.create(), vec2.create(), vec2.create()]
]

const getBoxCorners = (corners: vec2[], centre: ReadonlyVec2, radius: number): void => {
    const hradius = radius / 2
    corners[0][0] = centre[0] - hradius
    corners[1][0] = centre[0] - hradius
    corners[2][0] = centre[0] + hradius
    corners[3][0] = centre[0] + hradius

    corners[0][1] = centre[1] - hradius
    corners[1][1] = centre[1] + hradius
    corners[2][1] = centre[1] + hradius
    corners[3][1] = centre[1] - hradius
}

let p0: ReadonlyVec2
let c0 = vec2.create()
let c1 = vec2.create()
const H_BLOCK_SIZE = BLOCK_SIZE
const depthSort = (a: Block, b: Block): number => {
    c0[0] = a.origin[0] + H_BLOCK_SIZE
    c0[1] = a.origin[1] + H_BLOCK_SIZE
    c1[0] = b.origin[0] + H_BLOCK_SIZE
    c1[1] = b.origin[1] + H_BLOCK_SIZE
    return vec2.squaredDistance(c1, p0) - vec2.squaredDistance(c0, p0)
}

export const getBlocks = (
    blocks: LinkedList<Block>,
    { info: { radius } }: Physics,
    p0in: ReadonlyVec2,
    p1: ReadonlyVec2
): void => {
    p0 = p0in
    blocks.clear()

    // Based upon thing radius, find all intersected blocks from the blockmap
    getBoxCorners(allCorners[0], p0, radius)
    getBoxCorners(allCorners[1], p1, radius)

    for (const corners of allCorners) {
        for (const corner of corners) {
            const block = getBlock(corner)
            if (block !== undefined) {
                if (!contains(blocks, block)) {
                    // Reverse sort because collision detection accesses blocks in reverse order (don't ask)
                    blocks.sortedAdd(block, depthSort)
                }
            }
        }
    }
}
