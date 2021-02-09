import { ReadonlyVec2, vec2, vec3 } from 'gl-matrix'
import { findLinkedList, forEachLinkedList, LinkedList } from 'low-mem'
import { isStatefulObjectThing } from '../global'
import { Block } from '../interfaces/BlockMap'
import { StatefulObjectThing } from '../interfaces/State'
import { circleCircleIntersection } from '../maths/circleCircleIntersection'

export interface ThingCollisionCheckResult {
    allow: boolean
    statefuls: LinkedList<StatefulObjectThing>
}

let index: number
let p0: ReadonlyVec2
let p1: ReadonlyVec2
let radius: number

// Temporary variables used to store conversion from vec3 to vec2
let temp0 = vec2.create()
let temp1 = vec2.create()

const candidates = new LinkedList<StatefulObjectThing>()

const curryDepthSort = () => {
    return (a: StatefulObjectThing, b: StatefulObjectThing) => {
        temp0[0] = a.geometry!.position[0]
        temp0[1] = a.geometry!.position[2]
        temp1[0] = b.geometry!.position[0]
        temp1[1] = b.geometry!.position[2]
        return vec2.sqrDist(temp0, p0) - vec2.sqrDist(temp1, p0)
    }
}
const depthSort = curryDepthSort()

const isSolid = (thing: StatefulObjectThing): boolean => thing.info.flags.solid

const addCandidates = (block: Block): void => {
    let entry = block.statefuls.next()
    while (entry !== undefined) {
        if (isStatefulObjectThing(entry.item) && entry.item.geometry.visible && entry.item.thing.index !== index) {
            temp0[0] = entry.item.geometry!.position[0]
            temp0[1] = entry.item.geometry!.position[2]
            if (circleCircleIntersection(temp0, entry.item.info.radius, p1, radius)) {
                candidates.sortedAdd(entry.item, depthSort)
            }
        }
        entry = block.statefuls.next(entry)
    }
}

export const thingCollisionCheck = (
    thingCollisions: ThingCollisionCheckResult,
    blocks: LinkedList<Block>,
    indexIn: number,
    radiusIn: number,
    p0in: ReadonlyVec2,
    p1in: vec2
): void => {
    p0 = p0in
    p1 = p1in
    radius = radiusIn
    thingCollisions.allow = true

    index = indexIn
    forEachLinkedList(blocks, addCandidates)

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
