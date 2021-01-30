import { vec2, vec3 } from 'gl-matrix'
import { Thing } from '../interfaces/Thing'
import { ThingInfoLookup } from '../things/ThingInfoLookup'
import { lineCollisionResponse } from './lineCollisionResponse'

const vec3tovec2 = (vec3: vec3): vec2 => [vec3[0], vec3[2]]

export const thingCollisionResponse = (thing: Thing, radius: number, p0: vec2, p1: vec2): vec2 => {
    const pos = vec3tovec2(thing.geometry!.position)
    const r2 = ThingInfoLookup[thing.type].radius

    const n = vec2.normalize(vec2.create(), vec2.subtract(vec2.create(), p0, pos))
    const sn = vec2.scale(vec2.create(), n, r2)
    const start = vec2.add(vec2.create(), pos, [sn[1], -sn[0]])
    const end = vec2.add(vec2.create(), pos, [-sn[1], sn[0]])

    return lineCollisionResponse(start, end, radius + r2, p0, p1)
}
