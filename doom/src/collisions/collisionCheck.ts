import { vec2 } from 'gl-matrix'
import { BlockMap } from '../interfaces/BlockMap'
import { Thing } from '../interfaces/Thing'
import { ThingInfoLookup } from '../things/ThingInfoLookup'
import { blockCheck } from './blockCheck'
import { lineCollisionResponse } from './lineCollisionResponse'
import { getBlocks } from './getBlocks'
import { lineCollisionCheck, LineCollisionCheckResult } from './lineCollisionCheck'
import { sectorCheck } from './sectorCheck'
import { thingCollisionCheck, ThingCollisionCheckResult } from './thingCollisionCheck'
import { thingCollisionResponse } from './thingCollisionResponse'
import { pickups } from '../game/pickups'

export const collisionCheck = (blockmap: BlockMap, thing: Thing, p0: vec2, p1: vec2): vec2 => {
    const blocks = getBlocks(blockmap, thing, p0, p1)
    const { radius } = ThingInfoLookup[thing.type]

    let thingCollisions: ThingCollisionCheckResult = { allow: false, things: [] }
    let lineCollisions: LineCollisionCheckResult = { allow: false, lines: [] }

    let infiniteLoopProtection = 0
    while (!(thingCollisions.allow && lineCollisions.allow)) {
        if (infiniteLoopProtection++ > 10) {
            console.warn('Bailing out of collision detection to prevent infinite loop')
        }

        // TODO maybe we can merge collision response and check logic for things and lines?
        thingCollisions = thingCollisionCheck(blocks, thing.index, radius, p0, p1)
        if (!thingCollisions.allow) {
            p1 = thingCollisionResponse(thingCollisions.things[thingCollisions.things.length - 1], radius, p0, p1)
        }

        lineCollisions = lineCollisionCheck(blocks, radius, p0, p1)
        if (!lineCollisions.allow) {
            const lines = lineCollisions.lines
            const { start, end } = lines[lines.length - 1]
            p1 = lineCollisionResponse(start, end, radius, p1)
        }
    }

    pickups(thingCollisions.things)

    blockCheck(blockmap, thing, p0, p1)
    sectorCheck(lineCollisions.lines, thing, p0, p1)

    return p1
}
