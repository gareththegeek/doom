import { ReadonlyVec2, vec2 } from 'gl-matrix'
import { Line } from '../interfaces/Sector'
import { projectPositionOntoLine } from './projectVectorOntoVector'

let closest = vec2.create()

export const lineCircleIntersection = (
    { start, end }: Line,
    centre: ReadonlyVec2,
    radius: number
): number | undefined => {
    projectPositionOntoLine(closest, centre, start, end)
    if (start[0] !== end[0]) {
        const left = start[0] < end[0] ? start : end
        const right = start[0] > end[0] ? start : end
        if (closest[0] > right[0]) {
            closest[0] = right[0]
            closest[1] = right[1]
        } else if (closest[0] < left[0]) {
            closest[0] = left[0]
            closest[1] = left[1]
        }
    } else {
        // vertical line
        const bottom = start[1] < end[1] ? start : end
        const top = start[1] > end[1] ? start : end
        if (closest[1] > top[1]) {
            closest[0] = top[0]
            closest[1] = top[1]
        } else if (closest[1] < bottom[1]) {
            closest[0] = bottom[0]
            closest[1] = bottom[1]
        }
    }
    const sqrDistance = vec2.sqrLen(vec2.subtract(vec2.create(), closest, centre))
    return sqrDistance <= radius * radius ? sqrDistance : undefined
}
