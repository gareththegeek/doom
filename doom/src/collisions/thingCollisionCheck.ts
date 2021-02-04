import { vec2, vec3 } from 'gl-matrix'
import { isStatefulThingObject } from '../global'
import { Block } from '../interfaces/BlockMap'
import { StatefulObject, StatefulObjectThing, StatefulThing } from '../interfaces/State'
import { circleCircleIntersection } from '../maths/circleCircleIntersection'

export interface ThingCollisionCheckResult {
    allow: boolean
    statefuls: StatefulObjectThing[]
}

const vec3tovec2 = (vec3: vec3): vec2 => [vec3[0], vec3[2]]

export const thingCollisionCheck = (
    blocks: Block[],
    index: number,
    radius: number,
    p0: vec2,
    p1: vec2
): ThingCollisionCheckResult => {
    const potentialStatefuls = blocks
        .flatMap((block) => block.statefuls)
        .filter(isStatefulThingObject)
        .filter((stateful) => stateful.geometry.visible)
        .filter((stateful) => stateful.thing.index !== index)
        .filter((stateful) => {
            return circleCircleIntersection(vec3tovec2(stateful.geometry!.position), stateful.info.radius, p1, radius)
        })
        .sort(
            (a, b) =>
                vec2.sqrDist(vec3tovec2(a.geometry!.position), p0) - vec2.sqrDist(vec3tovec2(b.geometry!.position), p0)
        )

    const statefuls: StatefulObjectThing[] = []
    for (const stateful of potentialStatefuls) {
        statefuls.push(stateful)
        if (stateful.info.flags.solid) {
            return {
                allow: false,
                statefuls
            }
        }
    }

    return {
        allow: true,
        statefuls
    }
}
