import { ReadonlyVec2, vec2 } from 'gl-matrix'
import { Block } from '../interfaces/BlockMap'
import { StatefulThing } from '../interfaces/State'
import { getBlock } from './getBlock'

const getBoxCorners = (centre: ReadonlyVec2, radius: number): vec2[] => {
    const hradius = radius / 2
    return [
        [centre[0] - hradius, centre[1] - hradius],
        [centre[0] - hradius, centre[1] + hradius],
        [centre[0] + hradius, centre[1] + hradius],
        [centre[0] + hradius, centre[1] - hradius]
    ]
}

const isDefined = (block: Block | undefined): block is Block => block !== undefined

export const getBlocks = ({ info: { radius } }: StatefulThing, p0: ReadonlyVec2, p1: ReadonlyVec2): Block[] => {
    // Based upon thing radius, find all intersected blocks from the blockmap
    const corners = [...getBoxCorners(p0, radius), ...getBoxCorners(p1, radius)]
    const blocks = corners.map((corner) => getBlock(corner)).filter(isDefined)
    return [...new Set(blocks)]
}
