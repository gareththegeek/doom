import { vec2 } from 'gl-matrix'
import { BlockMap } from '../interfaces/BlockMap'
import { Thing } from '../interfaces/Thing'
import { ThingInfoLookup } from '../things/ThingInfoLookup'
import { blockCheck } from './blockCheck'
import { collisionResponse } from './collisionResponse'
import { getBlocks } from './getBlocks'
import { lineCollisionCheck } from './lineCollisionCheck'
import { sectorCheck } from './sectorCheck'
import { thingCollisionCheck } from './thingCollisionCheck'

export const collisionCheck = (blockmap: BlockMap, thing: Thing, p0: vec2, p1: vec2): vec2 => {
    const blocks = getBlocks(blockmap, thing, p0, p1)
    const radius = ThingInfoLookup[thing.type].radius

    const thingCollisions = thingCollisionCheck(blocks, thing, p0, p1)
    if (!thingCollisions.allow) {
        //TODO slide?
        return p0
    }
    //TODO pick up thingCollisions.things
    const lineCollisions = lineCollisionCheck(blocks, radius, p0, p1)
    if (!lineCollisions.allow) {
        const lines = lineCollisions.lines
        p1 = collisionResponse(lines[lines.length - 1], radius, p0, p1)
        //TODO repeated collision check and response because new p1 might also be illegal
    }
    blockCheck(blockmap, thing, p0, p1)
    sectorCheck(lineCollisions.lines, thing, p0, p1)

    return p1
}
