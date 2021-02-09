import { ReadonlyVec2, vec2 } from 'gl-matrix'

export const circleCircleIntersection = (p0: ReadonlyVec2, r0: number, p1: ReadonlyVec2, r1: number): boolean =>
    vec2.sqrDist(p0, p1) <= (r0 + r1) * (r0 + r1)
