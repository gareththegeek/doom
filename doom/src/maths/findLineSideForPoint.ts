import { vec2 } from 'gl-matrix'
import { Line } from '../interfaces/Line'
import { Side } from '../interfaces/Side'

export interface LineSideResult {
    side: Side | undefined
    other: Side | undefined
}

export const pointIsLeftOfLine = (start: vec2, end: vec2, point: vec2): boolean =>
    (end[0] - start[0]) * (point[1] - start[1]) -
        (end[1] - start[1]) * (point[0] - start[0]) >
    0

export const findLineSideForPoint = (line: Line, point: vec2): LineSideResult => {
    const isLeft = pointIsLeftOfLine(line.start, line.end, point)

    return isLeft
        ? {
              side: line.front,
              other: line.back
          }
        : {
              side: line.back,
              other: line.front
          }
}
