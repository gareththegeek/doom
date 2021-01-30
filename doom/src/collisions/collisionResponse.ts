import { vec2 } from 'gl-matrix'
import { Line } from '../interfaces/Line'
import { pointIsLeftOfLine } from '../maths/findLineSideForPoint'
import { projectPositionOntoLine } from '../maths/projectVectorOntoVector'

const getLineNormal = (line: Line, side: vec2): vec2 => {
    const v = vec2.subtract(vec2.create(), line.end, line.start)
    return pointIsLeftOfLine(line, side) ? [-v[1], v[0]] : [v[1], -v[0]]
}

export const collisionResponse = (line: Line, radius: number, p0: vec2, p1: vec2): vec2 => {
    const clipped = projectPositionOntoLine(p1, line.start, line.end)
    const normal = vec2.normalize(vec2.create(), getLineNormal(line, p0))
    const offset = vec2.scale(vec2.create(), normal, radius)
    return vec2.add(vec2.create(), clipped, offset)
}
