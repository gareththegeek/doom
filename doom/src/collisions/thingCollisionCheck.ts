import { ReadonlyVec2, vec2, vec3 } from 'gl-matrix'
import { findLinkedList, LinkedList } from 'low-mem'
import { isStatefulObjectThing } from '../global'
import { Block } from '../interfaces/BlockMap'
import { StatefulObjectThing } from '../interfaces/State'
import { circleCircleIntersection } from '../maths/circleCircleIntersection'

export interface ThingCollisionCheckResult {
    allow: boolean
    statefuls: LinkedList<StatefulObjectThing>
}

let p0: ReadonlyVec2
const candidates = new LinkedList<StatefulObjectThing>()

const vec3tovec2 = (vec3: vec3): vec2 => [vec3[0], vec3[2]]

const curryDepthSort = () => {
    return (a: StatefulObjectThing, b: StatefulObjectThing) =>
        vec2.sqrDist(vec3tovec2(a.geometry!.position), p0) - vec2.sqrDist(vec3tovec2(b.geometry!.position), p0)
}
const depthSort = curryDepthSort()

const isSolid = (thing: StatefulObjectThing): boolean => thing.info.flags.solid

export const thingCollisionCheck = (
    thingCollisions: ThingCollisionCheckResult,
    blocks: Block[],
    index: number,
    radius: number,
    p0in: ReadonlyVec2,
    p1: vec2
): void => {
    p0 = p0in
    thingCollisions.allow = true

    for (const block of blocks) {
        let entry = block.statefuls.next()
        while (entry !== undefined) {
            if (
                isStatefulObjectThing(entry.item) &&
                entry.item.geometry.visible &&
                entry.item.thing.index !== index &&
                circleCircleIntersection(vec3tovec2(entry.item.geometry!.position), entry.item.info.radius, p1, radius)
            ) {
                candidates.sortedAdd(entry.item, depthSort)
            }
            entry = block.statefuls.next(entry)
        }
    }

    let current = candidates.next()
    while (current !== undefined) {
        thingCollisions.statefuls.add(current.item)

        if (isSolid(current.item)) {
            thingCollisions.allow = false
            break
        }
        current = candidates.next(current)
    }

    candidates.clear()
}

export const resetThingResult = (thingCollisions: ThingCollisionCheckResult): void => {
    thingCollisions.allow = false
    thingCollisions.statefuls.clear()
}
