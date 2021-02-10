import { ReadonlyVec2, vec2 } from 'gl-matrix'
import { blockCheck } from './blockCheck'
import { lineCollisionResponse } from './lineCollisionResponse'
import { getBlocks } from './getBlocks'
import { sectorCheck } from './sectorCheck'
import { thingCollisionResponse } from './thingCollisionResponse'
import { pickups } from '../items/pickups'
import { StatefulObjectThing, StatefulThing } from '../interfaces/State'
import { LinkedList } from 'low-mem'
import { Block } from '../interfaces/BlockMap'
import { G } from '../global'
import { collisionCheck, CollisionCheckResult, Intersection, resetCollisionResult } from './collisionCheck'
import { Line } from '../interfaces/Sector'

const collisions: CollisionCheckResult = {
    allow: false,
    intersections: new LinkedList<Intersection>()
}

const blocks = new LinkedList<Block>()

export const moveStateful = (stateful: StatefulThing, p0: ReadonlyVec2, p1: vec2): void => {
    const {
        cheats: { noclip }
    } = G

    getBlocks(blocks, stateful, p0, p1)
    const { radius } = stateful.info

    collisions.allow = false

    let infiniteLoopProtection = 0
    while (!collisions.allow) {
        resetCollisionResult(collisions)

        collisionCheck(stateful, collisions, blocks, radius, p0, p1)
        if (!collisions.allow) {
            const last = collisions.intersections.last()!.item
            if (last.isLine) {
                const line = last.collider as Line
                lineCollisionResponse(p1, line.start, line.end, radius, p0, p1)
            } else {
                thingCollisionResponse(p1, last.collider as StatefulObjectThing, radius, p0, p1)
            }
        }

        if (++infiniteLoopProtection > 2) {
            p1[0] = p0[0]
            p1[1] = p0[1]
            break
        }

        collisions.allow ||= noclip
    }
    pickups(collisions.intersections)

    blockCheck(stateful, p1)
    sectorCheck(collisions.intersections, stateful, p0, p1)
}
