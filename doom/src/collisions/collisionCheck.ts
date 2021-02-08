import { vec2 } from 'gl-matrix'
import { blockCheck } from './blockCheck'
import { lineCollisionResponse } from './lineCollisionResponse'
import { getBlocks } from './getBlocks'
import { lineCollisionCheck, LineCollisionCheckResult } from './lineCollisionCheck'
import { sectorCheck } from './sectorCheck'
import { thingCollisionCheck, ThingCollisionCheckResult } from './thingCollisionCheck'
import { thingCollisionResponse } from './thingCollisionResponse'
import { pickups } from '../items/pickups'
import { StatefulObjectThing, StatefulThing } from '../interfaces/State'
import { LinkedList } from 'low-mem'

let last: StatefulObjectThing | undefined
let thingCollisions: ThingCollisionCheckResult = {
    allow: false,
    statefuls: new LinkedList()
}

export const collisionCheck = (postCollisionPosition: vec2, stateful: StatefulThing, p0: vec2, p1: vec2): void => {
    const blocks = getBlocks(stateful, p0, p1)
    const { radius } = stateful.info
    const { index } = stateful.thing

    thingCollisions.statefuls.clear()
    let lineCollisions: LineCollisionCheckResult = { allow: false, lines: [] }

    let infiniteLoopProtection = 0
    while (!(thingCollisions.allow && lineCollisions.allow)) {
        // TODO maybe we can merge collision response and check logic for things and lines?
        last = thingCollisionCheck(thingCollisions, blocks, index, radius, p0, p1)
        if (!thingCollisions.allow) {
            p1 = thingCollisionResponse(last!, radius, p0, p1)
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

    blockCheck(stateful, p1)
    sectorCheck(lineCollisions.lines, stateful, p0, p1)

    postCollisionPosition[0] = p1[0]
    postCollisionPosition[1] = p1[1]
}
