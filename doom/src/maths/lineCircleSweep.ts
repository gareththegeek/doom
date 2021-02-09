import { ReadonlyVec2 } from 'gl-matrix'
import { Line } from '../interfaces/Sector'
import { lineCircleIntersection } from './lineCircleIntersection'
import { lineRayIntersection } from './lineLineIntersection'

export const lineCircleSweep = (line: Line, p0: ReadonlyVec2, p1: ReadonlyVec2, radius: number): number | undefined => {
    let centre = p1
    const intersection = lineRayIntersection(p0, p1, line.start, line.end)
    if (intersection !== undefined) {
        centre = intersection
    }
    return lineCircleIntersection(line, centre, radius)
}
