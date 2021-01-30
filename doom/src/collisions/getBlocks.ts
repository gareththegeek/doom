import { vec2 } from 'gl-matrix'
import { Block, BlockMap } from '../interfaces/BlockMap'
import { Thing } from '../interfaces/Thing'
import { ThingInfoLookup } from '../things/ThingInfoLookup'
import { getBlock } from './getBlock'

const getBoxCorners = (centre: vec2, radius: number): vec2[] => {
    const hradius = radius / 2
    return [
        [centre[0] - hradius, centre[1] - hradius],
        [centre[0] - hradius, centre[1] + hradius],
        [centre[0] + hradius, centre[1] + hradius],
        [centre[0] + hradius, centre[1] - hradius]
    ]
}

export const getBlocks = (blockmap: BlockMap, thing: Thing, p0: vec2, p1: vec2): Block[] => {
    // Based upon thing radius, find all intersected blocks from the blockmap
    const info = ThingInfoLookup[thing.type]
    const corners = [...getBoxCorners(p0, info.radius), ...getBoxCorners(p1, info.radius)]
    return [...new Set(corners.map((corner) => getBlock(blockmap, corner)))]
}
