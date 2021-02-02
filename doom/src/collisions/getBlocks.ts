import { BlockMap, getBlock, Thing, ThingInfoLookup } from 'doom-map'
import { Block } from 'doom-map/dist/interfaces/BlockMap'
import { vec2 } from 'gl-matrix'

const getBoxCorners = (centre: vec2, radius: number): vec2[] => {
    const hradius = radius / 2
    return [
        [centre[0] - hradius, centre[1] - hradius],
        [centre[0] - hradius, centre[1] + hradius],
        [centre[0] + hradius, centre[1] + hradius],
        [centre[0] + hradius, centre[1] - hradius]
    ]
}

const isDefined = (block: Block | undefined): block is Block => block !== undefined

export const getBlocks = (blockmap: BlockMap, thing: Thing, p0: vec2, p1: vec2): Block[] => {
    // Based upon thing radius, find all intersected blocks from the blockmap
    const info = ThingInfoLookup[thing.type]
    const corners = [...getBoxCorners(p0, info.radius), ...getBoxCorners(p1, info.radius)]
    const blocks = corners.map((corner) => getBlock(blockmap, corner)).filter(isDefined)
    return [...new Set(blocks)]
}
