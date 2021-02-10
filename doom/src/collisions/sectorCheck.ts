import PubSub from 'pubsub-js'
import { ReadonlyVec2, vec2 } from 'gl-matrix'
import { WALK_LINE } from '../interfaces/messageTypes'
import { findLineSideForPoint, LineSideResult } from '../maths/findLineSideForPoint'
import { LineIntersectionResult, lineLineIntersection } from '../maths/lineLineIntersection'
import { changeSector } from './changeSector'
import { Stateful } from '../interfaces/State'
import { forEachLinkedListReverse, LinkedList } from 'low-mem'
import { Intersection } from './collisionCheck'
import { Line } from '../interfaces/Sector'

let p0: ReadonlyVec2
let p1: ReadonlyVec2
let stateful: Stateful
const lineSideResult = {} as LineSideResult

const intersection: LineIntersectionResult = { intersects: false, point: vec2.create() }

const sectorCheckLine = ({ isLine, collider }: Intersection) => {
    if (!isLine) {
        return
    }
    const line = collider as Line
    // Lines are sorted from closest to farthest - work backwards to find the furthest line crossing
    lineLineIntersection(intersection, p0, p1, line.start, line.end)
    if (intersection.intersects) {
        findLineSideForPoint(lineSideResult, line, p1)
        const { side } = lineSideResult
        if (side === undefined) {
            // I think this can't happen but we'll see
            console.warn(`Missing side in sector check side:${side}`)
            return
        }
        changeSector(stateful, side.sector)
        PubSub.publish(WALK_LINE, line)
    }
}

export const sectorCheck = (
    intersections: LinkedList<Intersection>,
    statefulIn: Stateful,
    p0in: ReadonlyVec2,
    p1in: ReadonlyVec2
): void => {
    p0 = p0in
    p1 = p1in
    stateful = statefulIn
    forEachLinkedListReverse(intersections, sectorCheckLine)
}
