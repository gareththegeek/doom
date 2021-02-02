import PubSub from 'pubsub-js'
import { Thing, Sector, Line } from 'doom-map'
import { vec2 } from 'gl-matrix'
import { WALK_LINE } from '../interfaces/messageTypes'
import { findLineSideForPoint } from '../maths/findLineSideForPoint'
import { lineLineIntersection } from '../maths/lineLineIntersection'
import { changeSector } from './changeSector'

export const sectorCheck = (lines: Line[], thing: Thing, p0: vec2, p1: vec2): void => {
    //TODO check if _centre_ of thing has intersected the lines
    // for all intersected lines find furthest intersection from p0
    // move thing to new sector (on far side of furthest intersected line)
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
            changeSector(thing, side.sector)
            PubSub.publish(WALK_LINE, { line })
        }
    }
}
