import { vec2, vec3 } from 'gl-matrix'
import { LinkedList, LinkedListEntry } from 'low-mem'
import { isStatefulObjectThing } from '../global'
import { Block } from '../interfaces/BlockMap'
import { StatefulObjectThing } from '../interfaces/State'
import { circleCircleIntersection } from '../maths/circleCircleIntersection'

export interface ThingCollisionCheckResult {
    allow: boolean
    statefuls: LinkedList<StatefulObjectThing>
}

let p0: vec2

const vec3tovec2 = (vec3: vec3): vec2 => [vec3[0], vec3[2]]

const curryDepthSort = () => {
    return (a: StatefulObjectThing, b: StatefulObjectThing) =>
        vec2.sqrDist(vec3tovec2(a.geometry!.position), p0) - vec2.sqrDist(vec3tovec2(b.geometry!.position), p0)
}
const depthSort = curryDepthSort()

export const thingCollisionCheck = (
    thingCollisions: ThingCollisionCheckResult,
    blocks: Block[],
    index: number,
    radius: number,
    p0in: vec2,
    p1: vec2
): StatefulObjectThing | undefined => {
    p0 = p0in

    for (const block of blocks) {
        let entry = block.statefuls.next()
        while (entry !== undefined) {
            if (
                isStatefulObjectThing(entry.item) &&
                entry.item.geometry.visible &&
                entry.item.thing.index !== index &&
                circleCircleIntersection(vec3tovec2(entry.item.geometry!.position), entry.item.info.radius, p1, radius)
            ) {
                thingCollisions.statefuls.sortedAdd(entry.item, depthSort)
                if (entry.item.info.flags.solid) {
                    thingCollisions.allow = false
                    return entry.item
                }
            }
            entry = block.statefuls.next(entry)
        }
    }
    thingCollisions.allow = true
    return undefined
}
