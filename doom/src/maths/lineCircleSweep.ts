import { ReadonlyVec2, vec2 } from 'gl-matrix'
import { lineCircleIntersection } from './lineCircleIntersection'
import { LineIntersectionResult, lineRayIntersection } from './lineLineIntersection'

const intersection: LineIntersectionResult = { intersects: false, point: vec2.create() }

export const lineCircleSweep = (start: ReadonlyVec2, end: ReadonlyVec2, p0: ReadonlyVec2, p1: ReadonlyVec2, radius: number): number | undefined => {
    let centre = p1
    lineRayIntersection(intersection, p0, p1, start, end)

    if (intersection.intersects) {
        centre = intersection.point
    }
    return lineCircleIntersection(start, end, centre, radius)
}
