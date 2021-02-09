import { vec2 } from 'gl-matrix'
import { HomogenousHeap, LinkedList, forEachLinkedList } from 'low-mem'
import { Block } from '../interfaces/BlockMap'
import { Line } from '../interfaces/Sector'
import { findLineSideForPoint } from '../maths/findLineSideForPoint'
import { lineCircleSweep } from '../maths/lineCircleSweep'

let p0: vec2

export interface LineCollisionCheckResult {
    allow: boolean
    lines: LinkedList<LineIntersection>
}

export interface LineIntersection {
    line: Line
    distance: number
}

const candidates = new LinkedList<LineIntersection>()

const NULL_LINE: Line = {} as Line
const createLineIntersection = () => ({ line: NULL_LINE, distance: 0 })
const lineIntersectionHeap = new HomogenousHeap<LineIntersection>(createLineIntersection)

const depthSort = (a: LineIntersection, b: LineIntersection): number => a.distance - b.distance

const isSolid = ({ line }: LineIntersection): boolean => {
    if (line.back === undefined) {
        return true
    }
    if (line.flags.blocks) {
        return true
    }

    const { side, other } = findLineSideForPoint(line, p0)
    if (side === undefined || other === undefined) {
        // I think this can't happen but we'll see
        console.warn(`Missing side in line collision check side:${side} other:${other}`)
        return true
    }
    if (other.sector.floorHeight - side.sector.floorHeight > 24) {
        return true
    }
    if (other.sector.ceilingHeight - other.sector.floorHeight < 56) {
        return true
    }
    if (other.sector.ceilingHeight - side.sector.floorHeight < 56) {
        return true
    }
    return false
}

export const lineCollisionCheck = (
    lineCollisions: LineCollisionCheckResult,
    blocks: Block[],
    radius: number,
    p0in: vec2,
    p1: vec2
): void => {
    //TODO thing sphere to line intersection check and then check for legal moves
    // e.g. two sided lines
    // step max 24
    // height min 80 - (disabled)
    // return a list of intersected lines

    p0 = p0in
    lineCollisions.allow = true

    for (const block of blocks) {
        for (const line of block.lines) {
            const distance = lineCircleSweep(line, p0, p1, radius)
            if (distance === undefined) {
                continue
            }
            const intersection = lineIntersectionHeap.allocate()
            intersection.line = line
            intersection.distance = distance
            candidates.sortedAdd(intersection, depthSort)
        }
    }

    let current = candidates.next()
    while (current !== undefined) {
        lineCollisions.lines.add(current.item)

        if (isSolid(current.item)) {
            lineCollisions.allow = false
            break
        }
        current = candidates.next(current)
    }

    freeLineIntersections(candidates)
}

const freeIntersection = (intersection: LineIntersection): void => {
    lineIntersectionHeap.free(intersection)
}

const freeLineIntersections = (intersections: LinkedList<LineIntersection>): void => {
    forEachLinkedList(intersections, freeIntersection)
    intersections.clear()
}

export const resetLineResult = (lineCollisions: LineCollisionCheckResult): void => {
    freeLineIntersections(lineCollisions.lines)
    lineCollisions.allow = false
}
