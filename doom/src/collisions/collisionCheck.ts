import { vec2 } from 'gl-matrix'
import { blockCheck } from './blockCheck'
import { lineCollisionResponse } from './lineCollisionResponse'
import { getBlocks } from './getBlocks'
import { lineCollisionCheck, LineCollisionCheckResult } from './lineCollisionCheck'
import { sectorCheck } from './sectorCheck'
import { thingCollisionCheck, ThingCollisionCheckResult } from './thingCollisionCheck'
import { thingCollisionResponse } from './thingCollisionResponse'
import { pickups } from '../items/pickups'
import { BlockMap, Thing } from 'doom-map'
import { ThingInfoLookup } from '../interfaces/ThingInfoLookup'

export const collisionCheck = (blockmap: BlockMap, thing: Thing, p0: vec2, p1: vec2): vec2 => {
    const blocks = getBlocks(blockmap, thing, p0, p1)
    const { radius } = ThingInfoLookup[thing.type]

    let thingCollisions: ThingCollisionCheckResult = { allow: false, things: [] }
    let lineCollisions: LineCollisionCheckResult = { allow: false, lines: [] }

    let infiniteLoopProtection = 0
    while (!(thingCollisions.allow && lineCollisions.allow)) {
        // TODO maybe we can merge collision response and check logic for things and lines?
        thingCollisions = thingCollisionCheck(blocks, thing.index, radius, p0, p1)
        if (!thingCollisions.allow) {
            p1 = thingCollisionResponse(thingCollisions.things[thingCollisions.things.length - 1], radius, p0, p1)
        }

        lineCollisions = lineCollisionCheck(blocks, radius, p0, p1)
        if (!lineCollisions.allow) {
            const lines = lineCollisions.lines
            const { start, end } = lines[lines.length - 1]
            p1 = lineCollisionResponse(start, end, radius, p0, p1)
        }

        if (++infiniteLoopProtection > 2) {
            p1 = p0
            break
        }
    }

    pickups(thingCollisions.things)

    blockCheck(blockmap, thing, p0, p1)
    sectorCheck(lineCollisions.lines, thing, p0, p1)

    return p1
}
