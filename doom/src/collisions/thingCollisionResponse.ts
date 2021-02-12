import { ReadonlyVec2, vec2 } from 'gl-matrix'
import { Physics } from '../interfaces/State'
import { lineCollisionResponse } from './lineCollisionResponse'

let pos = vec2.create()
let n = vec2.create()
let sn = vec2.create()
let start = vec2.create()
let end = vec2.create()
let diff = vec2.create()
let axis1 = vec2.create()
let axis2 = vec2.create()

export const thingCollisionResponse = (
    pout: vec2,
    stateful: Physics,
    radius: number,
    p0: ReadonlyVec2,
    p1: ReadonlyVec2
): void => {
    pos[0] = stateful.geometry.position[0]
    pos[1] = stateful.geometry.position[2]
    const r2 = stateful.info.radius

    vec2.normalize(n, vec2.subtract(diff, p0, pos))
    vec2.scale(sn, n, r2)
    axis1[0] = sn[1]
    axis1[1] = -sn[0]
    vec2.add(start, pos, axis1)
    axis2[0] = -sn[1]
    axis2[1] = sn[0]
    vec2.add(end, pos, axis2)

    lineCollisionResponse(pout, start, end, radius + r2, p0, p1)
}
