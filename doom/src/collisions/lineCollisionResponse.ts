import { vec2 } from 'gl-matrix'
import { pointIsLeftOfLine } from '../maths/findLineSideForPoint'
import { projectPositionOntoLine } from '../maths/projectVectorOntoVector'

const getLineNormal = (start: vec2, end: vec2, side: vec2): vec2 => {
    const v = vec2.subtract(vec2.create(), end, start)
    return pointIsLeftOfLine(start, end, side) ? [-v[1], v[0]] : [v[1], -v[0]]
}

export const lineCollisionResponse = (start: vec2, end: vec2, radius: number, p1: vec2): vec2 => {
    const clipped = projectPositionOntoLine(p1, start, end)
    const normal = vec2.normalize(vec2.create(), getLineNormal(start, end, p1))
    const offset = vec2.scale(vec2.create(), normal, radius + 0.5)
    return vec2.add(vec2.create(), clipped, offset)
}
