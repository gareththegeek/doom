import { ReadonlyVec2, vec2 } from 'gl-matrix'
import { pointIsLeftOfLine } from '../maths/findLineSideForPoint'
import { projectPositionOntoLine } from '../maths/projectVectorOntoVector'

let v = vec2.create()

const getLineNormal = (pout: vec2, start: ReadonlyVec2, end: ReadonlyVec2, side: ReadonlyVec2): void => {
    vec2.subtract(v, end, start)
    if (pointIsLeftOfLine(start, end, side)) {
        pout[0] = -v[1]
        pout[1] = v[0]
    } else {
        pout[0] = v[1]
        pout[1] = -v[0]
    }
}

let clipped = vec2.create()
let normal = vec2.create()
let offset = vec2.create()

export const lineCollisionResponse = (
    pout: vec2,
    start: ReadonlyVec2,
    end: ReadonlyVec2,
    radius: number,
    p0: ReadonlyVec2,
    p1: ReadonlyVec2
): void => {
    projectPositionOntoLine(clipped, p1, start, end)
    getLineNormal(normal, start, end, p0)
    vec2.normalize(normal, normal)
    vec2.scale(offset, normal, radius + 1.0)
    vec2.add(pout, clipped, offset)
}
