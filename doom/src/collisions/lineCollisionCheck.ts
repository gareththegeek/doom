import { vec2 } from 'gl-matrix'
import { Block } from '../interfaces/BlockMap'
import { Line } from '../interfaces/Line'
import { findLineSideForPoint } from '../maths/findLineSideForPoint'
import { lineCircleIntersection } from '../maths/lineCircleIntersection'

export interface LineCollisionCheckResult {
    allow: boolean
    lines: Line[]
}

const intersects = (result: {
    line: Line
    intersection: number | undefined
}): result is { line: Line; intersection: number } => result.intersection !== undefined

export const lineCollisionCheck = (blocks: Block[], radius: number, p0: vec2, p1: vec2): LineCollisionCheckResult => {
    //TODO thing sphere to line intersection check and then check for legal moves
    // e.g. two sided lines
    // step max 24
    // height min 80 - (disabled)
    // return a list of intersected lines

    const potentialLines = blocks
        .flatMap((block) => block.lines)
        .map((line) => ({
            line,
            intersection: lineCircleIntersection(line, p1, radius)
        }))
        .filter(intersects)
        .sort((a, b) => a.intersection - b.intersection)
        .map((intersection) => intersection.line)

    const lines = []
    for (const line of potentialLines) {
        lines.push(line)
        if (line.back === undefined) {
            return { allow: false, lines }
        }
        if (line.flags.blocks) {
            return { allow: false, lines }
        }

        const { side, other } = findLineSideForPoint(line, p0)
        if (side === undefined || other === undefined) {
            // I think this can't happen but we'll see
            console.warn(`Missing side in line collision check side:${side} other:${other}`)
            continue
        }
        if (other.sector.floorHeight - side.sector.floorHeight > 24) {
            return { allow: false, lines }
        }
        // TODO enable this once doors and stuff work
        // if (other.sector.ceilingHeight - other.sector.floorHeight < 80) {
        //     return { allow: false, lines }
        // }
    }

    return {
        allow: true,
        lines
    }
}
