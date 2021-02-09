import PubSub from 'pubsub-js'
import { ReadonlyVec2, vec2 } from 'gl-matrix'
import { WALK_LINE } from '../interfaces/messageTypes'
import { findLineSideForPoint } from '../maths/findLineSideForPoint'
import { lineLineIntersection } from '../maths/lineLineIntersection'
import { changeSector } from './changeSector'
import { Stateful } from '../interfaces/State'
import { forEachLinkedListReverse, LinkedList } from 'low-mem'
import { LineIntersection } from './lineCollisionCheck'

let p0: ReadonlyVec2
let p1: ReadonlyVec2
let stateful: Stateful

const sectorCheckLine = ({ line }: LineIntersection) => {
    // Lines are sorted from closest to farthest - work backwards to find the furthest line crossing
    if (lineLineIntersection(p0, p1, line.start, line.end) !== undefined) {
        const { side } = findLineSideForPoint(line, p1)
        if (side === undefined) {
            // I think this can't happen but we'll see
            console.warn(`Missing side in sector check side:${side}`)
            return
        }
        changeSector(stateful, side.sector)
        PubSub.publish(WALK_LINE, { line })
    }
}

export const sectorCheck = (
    lines: LinkedList<LineIntersection>,
    statefulIn: Stateful,
    p0in: ReadonlyVec2,
    p1in: ReadonlyVec2
): void => {
    p0 = p0in
    p1 = p1in
    stateful = statefulIn
    forEachLinkedListReverse(lines, sectorCheckLine)
}
