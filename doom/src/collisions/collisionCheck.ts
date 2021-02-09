import { ReadonlyVec2, vec2 } from 'gl-matrix'
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
import { Block } from '../interfaces/BlockMap'

let thingCollisions: ThingCollisionCheckResult = {
    allow: false,
    statefuls: new LinkedList()
}

let lineCollisions: LineCollisionCheckResult = {
    allow: false,
    lines: new LinkedList()
}

const blocks = new LinkedList<Block>()

export const collisionCheck = (stateful: StatefulThing, p0: ReadonlyVec2, p1: vec2): void => {
    getBlocks(blocks, stateful, p0, p1)
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
            thingCollisionResponse(p1, last, radius, p0, p1)
        }

        lineCollisionCheck(lineCollisions, blocks, radius, p0, p1)
        if (!lineCollisions.allow) {
            const last = lineCollisions.lines.last()!.item.line
            lineCollisionResponse(p1, last.start, last.end, radius, p0, p1)
        }

        if (++infiniteLoopProtection > 2) {
            p1[0] = p0[0]
            p1[1] = p0[1]
            break
        }
    }
    pickups(thingCollisions.statefuls)

    blockCheck(stateful, p1)
    sectorCheck(lineCollisions.lines, stateful, p0, p1)
}
