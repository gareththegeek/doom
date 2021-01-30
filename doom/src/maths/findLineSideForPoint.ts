import { vec2 } from 'gl-matrix'
import { Line } from '../interfaces/Line'
import { Side } from '../interfaces/Side'

export interface LineSideResult {
    side: Side | undefined
    other: Side | undefined
}

export const pointIsLeftOfLine = (line: Line, point: vec2): boolean =>
    (line.end[0] - line.start[0]) * (point[1] - line.start[1]) -
        (line.end[1] - line.start[1]) * (point[0] - line.start[0]) >
    0

export const findLineSideForPoint = (line: Line, point: vec2): LineSideResult => {
    const isLeft = pointIsLeftOfLine(line, point)

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
