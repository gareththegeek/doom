import { ReadonlyVec2, vec2 } from 'gl-matrix'
import { LinkedList } from 'low-mem'
import { Block } from '../interfaces/BlockMap'
import { StatefulThing } from '../interfaces/State'
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

export const getBlocks = (
    blocks: LinkedList<Block>,
    { info: { radius } }: StatefulThing,
    p0: ReadonlyVec2,
    p1: ReadonlyVec2
): void => {
    blocks.clear()

    // Based upon thing radius, find all intersected blocks from the blockmap
    getBoxCorners(allCorners[0], p0, radius)
    getBoxCorners(allCorners[1], p1, radius)

    for (const corners of allCorners) {
        for (const corner of corners) {
            const block = getBlock(corner)
            if (block !== undefined) {
                blocks.add(getBlock(corner))
            }
        }
    }
}
