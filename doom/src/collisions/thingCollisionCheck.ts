import { vec2, vec3 } from 'gl-matrix'
import { Block } from '../interfaces/BlockMap'
import { Thing } from '../interfaces/Thing'
import { circleCircleIntersection } from '../maths/circleCircleIntersection'
import { ThingInfoLookup } from '../things/ThingInfoLookup'

export interface ThingCollisionCheckResult {
    allow: boolean
    things: Thing[]
}

const vec3tovec2 = (vec3: vec3): vec2 => [vec3[0], vec3[2]]

export const thingCollisionCheck = (
    blocks: Block[],
    index: number,
    radius: number,
    p0: vec2,
    p1: vec2
): ThingCollisionCheckResult => {
    const potentialThings = blocks
        .flatMap((block) => block.things)
        .filter((thing) => thing.index !== index)
        .filter((thing) => thing.geometry !== undefined)
        .filter((thing) => {
            const info = ThingInfoLookup[thing.type]
            return circleCircleIntersection(vec3tovec2(thing.geometry!.position), info.radius, p1, radius)
        })
        .sort(
            (a, b) =>
                vec2.sqrDist(vec3tovec2(a.geometry!.position), p0) - vec2.sqrDist(vec3tovec2(b.geometry!.position), p0)
        )

    const things: Thing[] = []
    for (const thing of potentialThings) {
        things.push(thing)
        if (ThingInfoLookup[thing.type].obstacle) {
            return {
                allow: false,
                things
            }
        }
    }

    return {
        allow: true,
        things
    }
}
