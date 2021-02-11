import { ReadonlyVec2, vec2 } from 'gl-matrix'
import { forEachLinkedList, HomogenousHeap, LinkedList, LinkedListEntry, toArray } from 'low-mem'
import { isStatefulObjectThing } from '../global'
import { Block } from '../interfaces/BlockMap'
import { Line } from '../interfaces/Sector'
import { Stateful, StatefulObjectThing } from '../interfaces/State'
import { findLineSideForPoint, LineSideResult } from '../maths/findLineSideForPoint'
import { lineCircleIntersection } from '../maths/lineCircleIntersection'
import { lineCircleSweep } from '../maths/lineCircleSweep'
import { LineIntersectionResult, lineLineIntersection } from '../maths/lineLineIntersection'

export interface Intersection {
    distance: number
    isLine: boolean
    checked: boolean
    collider: StatefulObjectThing | Line
}

export interface CollisionCheckResult {
    allow: boolean
    intersections: LinkedList<Intersection>
}

let self: Stateful | undefined
let p0: ReadonlyVec2
let p1: ReadonlyVec2
let radius: number
let block: Block

// Temporary variables used to store conversion from vec3 to vec2
let temp0 = vec2.create()

const candidates = new LinkedList<Intersection>()

const NULL_LINE: Line = {} as Line
const createIntersection = (): Intersection => ({ distance: 0, isLine: false, checked: false, collider: NULL_LINE })
const intersectionHeap = new HomogenousHeap<Intersection>(createIntersection)

const depthSort = (a: Intersection, b: Intersection) => a.distance - b.distance

const addStatefulCandidates = (stateful: Stateful): void => {
    if (isStatefulObjectThing(stateful) && stateful.geometry.visible && stateful !== self) {
        temp0[0] = stateful.geometry!.position[0]
        temp0[1] = stateful.geometry!.position[2]
        if (temp0[0] === -192) debugger;
        if (lineCircleIntersection(p0, p1, temp0, stateful.info.radius + radius)) {
            const intersection = intersectionHeap.allocate()
            intersection.collider = stateful
            intersection.isLine = false
            intersection.checked = false
            intersection.distance = vec2.sqrDist(temp0, p0)
            candidates.sortedAdd(intersection, depthSort)
        }
    }
}

const lineIntersectionResult: LineIntersectionResult = {
    intersects: false,
    point: vec2.create()
}

const addLineCandidate = (line: Line): void => {
    let distance: number | undefined
    if (radius === 0) {
        lineLineIntersection(lineIntersectionResult, p0, p1, line.start, line.end)
        if (!lineIntersectionResult.intersects) {
            return
        }
        distance = vec2.squaredDistance(lineIntersectionResult.point, p0)
    } else {
        distance = lineCircleSweep(line.start, line.end, p0, p1, radius)
        if (distance === undefined) {
            return
        }
    }
    const intersection = intersectionHeap.allocate()
    intersection.collider = line
    intersection.isLine = true
    intersection.checked = false
    intersection.distance = distance
    candidates.sortedAdd(intersection, depthSort)
}

const addCandidates = (blockIn: Block): void => {
    block = blockIn

    forEachLinkedList(block.statefuls, addStatefulCandidates)
    block.lines.forEach(addLineCandidate)
}

const isStatefulSolid = (stateful: StatefulObjectThing): boolean => stateful.info.flags.solid

const lineSideResult = {} as LineSideResult
const isLineSolid = (line: Line): boolean => {
    if (line.back === undefined) {
        return true
    }
    if (line.flags.blocks) {
        return true
    }

    findLineSideForPoint(lineSideResult, line, p0)
    const { side, other } = lineSideResult
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

const isSolid = (intersection: Intersection): boolean =>
    intersection.isLine
        ? isLineSolid(intersection.collider as Line)
        : isStatefulSolid(intersection.collider as StatefulObjectThing)

export const collisionCheck = (
    selfIn: Stateful | undefined,
    collisions: CollisionCheckResult,
    blocks: LinkedList<Block>,
    radiusIn: number,
    p0in: ReadonlyVec2,
    p1in: vec2
): void => {
    self = selfIn
    p0 = p0in
    p1 = p1in
    radius = radiusIn
    collisions.allow = true

    let block = blocks.prev()

    while (block !== undefined) {
        addCandidates(block.item)

        let current = candidates.next()
        while (current !== undefined) {
            if (!current.item.checked) {
                collisions.intersections.sortedAdd(current.item, depthSort)

                if (isSolid(current.item)) {
                    collisions.allow = false
                    return
                }
                current.item.checked = true
            }
            current = candidates.next(current)
        }

        block = blocks.prev(block)
    }
}

const freeIntersection = (intersection: Intersection): void => {
    intersectionHeap.free(intersection)
}

const freeIntersections = (intersections: LinkedList<Intersection>): void => {
    forEachLinkedList(intersections, freeIntersection)
    intersections.clear()
}

export const resetCollisionResult = (collisions: CollisionCheckResult): void => {
    freeIntersections(candidates)
    collisions.intersections.clear()
    collisions.allow = false
}
