import { vec2 } from 'gl-matrix'
import { blockCheck } from './blockCheck'
import { lineCollisionResponse } from './lineCollisionResponse'
import { getBlocks } from './getBlocks'
import { lineCollisionCheck, LineCollisionCheckResult } from './lineCollisionCheck'
import { sectorCheck } from './sectorCheck'
import { thingCollisionCheck, ThingCollisionCheckResult } from './thingCollisionCheck'
import { thingCollisionResponse } from './thingCollisionResponse'
import { pickups } from '../items/pickups'
import { StatefulThing } from '../interfaces/State'

const last = <T>(array: T[]): T => array[array.length - 1]

export const collisionCheck = (stateful: StatefulThing, p0: vec2, p1: vec2): vec2 => {
    const blocks = getBlocks(stateful, p0, p1)
    const { radius } = stateful.info
    const { index } = stateful.thing

    let thingCollisions: ThingCollisionCheckResult = { allow: false, statefuls: [] }
    let lineCollisions: LineCollisionCheckResult = { allow: false, lines: [] }

    let infiniteLoopProtection = 0
    while (!(thingCollisions.allow && lineCollisions.allow)) {
        // TODO maybe we can merge collision response and check logic for things and lines?
        thingCollisions = thingCollisionCheck(blocks, index, radius, p0, p1)
        if (!thingCollisions.allow) {
            p1 = thingCollisionResponse(last(thingCollisions.statefuls), radius, p0, p1)
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
    pickups(thingCollisions.statefuls)

    blockCheck(stateful, p0, p1)
    sectorCheck(lineCollisions.lines, stateful, p0, p1)

    return p1
}
