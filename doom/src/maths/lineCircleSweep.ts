import { ReadonlyVec2, vec2 } from 'gl-matrix'
import { Line } from '../interfaces/Sector'
import { lineCircleIntersection } from './lineCircleIntersection'
import { LineIntersectionResult, lineRayIntersection } from './lineLineIntersection'

const intersection: LineIntersectionResult = { intersects: false, point: vec2.create() }

export const lineCircleSweep = (line: Line, p0: ReadonlyVec2, p1: ReadonlyVec2, radius: number): number | undefined => {
    let centre = p1
    lineRayIntersection(intersection, p0, p1, line.start, line.end)
    if (intersection.intersects) {
        centre = intersection.point
    }
    return lineCircleIntersection(line, centre, radius)
}
