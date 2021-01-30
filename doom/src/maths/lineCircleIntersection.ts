import { vec2 } from 'gl-matrix'
import { Line } from '../interfaces/Line'
import { projectPositionOntoLine } from './projectVectorOntoVector'

export const lineCircleIntersection = ({ start, end }: Line, centre: vec2, radius: number): number | undefined => {
    let closest = projectPositionOntoLine(centre, start, end)
    if (start[0] !== end[0]) {
        const left = start[0] < end[0] ? start : end
        const right = start[0] > end[0] ? start : end
        if (closest[0] > right[0]) {
            closest = right
        } else if (closest[0] < left[0]) {
            closest = left
        }
    } else {
        // vertical line
        const bottom = start[1] < end[1] ? start : end
        const top = start[1] > end[1] ? start : end
        if (closest[1] > top[1]) {
            closest = top
        } else if (closest[1] < bottom[1]) {
            closest = bottom
        }
    }
    const sqrDistance = vec2.sqrLen(vec2.subtract(vec2.create(), closest, centre))
    return sqrDistance <= radius * radius ? sqrDistance : undefined
}
