import PubSub from 'pubsub-js'
import { vec2 } from 'gl-matrix'
import { WALK_LINE } from '../interfaces/messageTypes'
import { findLineSideForPoint } from '../maths/findLineSideForPoint'
import { lineLineIntersection } from '../maths/lineLineIntersection'
import { changeSector } from './changeSector'
import { Line } from '../interfaces/Sector'
import { Stateful } from '../interfaces/State'

export const sectorCheck = (lines: Line[], stateful: Stateful, p0: vec2, p1: vec2): void => {
    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i]
        // Lines are sorted from closest to farthest - work backwards to find the furthest line crossing
        if (lineLineIntersection(p0, p1, line.start, line.end) !== undefined) {
            const { side } = findLineSideForPoint(line, p1)
            if (side === undefined) {
                // I think this can't happen but we'll see
                console.warn(`Missing side in sector check side:${side}`)
                continue
            }
            changeSector(stateful, side.sector)
            if (side !== side.line.front) {
                PubSub.publish(WALK_LINE, { line })
            }
        }
    }
}
