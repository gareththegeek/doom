import { ReadonlyVec2 } from 'gl-matrix'
import { Side, Line } from '../interfaces/Sector'

export interface LineSideResult {
    side: Side | undefined
    other: Side | undefined
}

export const pointIsLeftOfLine = (start: ReadonlyVec2, end: ReadonlyVec2, point: ReadonlyVec2): boolean =>
    (end[0] - start[0]) * (point[1] - start[1]) - (end[1] - start[1]) * (point[0] - start[0]) > 0

export const findLineSideForPoint = (result: LineSideResult, line: Line, point: ReadonlyVec2): void => {
    const isLeft = pointIsLeftOfLine(line.start, line.end, point)

    if (isLeft) {
        result.side = line.front
        result.other = line.back
    } else {
        result.side = line.back
        result.other = line.front
    }
}
