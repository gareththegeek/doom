import { vec2 } from 'gl-matrix'
import { blockCheck } from './blockCheck'
import { lineCollisionResponse } from './lineCollisionResponse'
import { getBlocks } from './getBlocks'
import { resetLineResult, lineCollisionCheck, LineCollisionCheckResult } from './lineCollisionCheck'
import { sectorCheck } from './sectorCheck'
import { resetThingResult, thingCollisionCheck, ThingCollisionCheckResult } from './thingCollisionCheck'
import { thingCollisionResponse } from './thingCollisionResponse'
import { pickups } from '../items/pickups'
import { StatefulThing } from '../interfaces/State'
import { LinkedList } from 'low-mem'

let thingCollisions: ThingCollisionCheckResult = {
    allow: false,
    statefuls: new LinkedList()
}

let lineCollisions: LineCollisionCheckResult = {
    allow: false,
    lines: new LinkedList()
}

export const collisionCheck = (postCollisionPosition: vec2, stateful: StatefulThing, p0: vec2, p1: vec2): void => {
    const blocks = getBlocks(stateful, p0, p1)
    const { radius } = stateful.info
    const { index } = stateful.thing

    thingCollisions.allow = false
    lineCollisions.allow = false

    let infiniteLoopProtection = 0
    while (!(thingCollisions.allow && lineCollisions.allow)) {
        resetThingResult(thingCollisions)
        resetLineResult(lineCollisions)

        // TODO maybe we can merge collision response and check logic for things and lines?
        thingCollisionCheck(thingCollisions, blocks, index, radius, p0, p1)
        if (!thingCollisions.allow) {
            const last = thingCollisions.statefuls.last()!.item
            p1 = thingCollisionResponse(last, radius, p0, p1)
        }

        lineCollisionCheck(lineCollisions, blocks, radius, p0, p1)
        if (!lineCollisions.allow) {
            const last = lineCollisions.lines.last()!.item.line
            p1 = lineCollisionResponse(last.start, last.end, radius, p0, p1)
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
