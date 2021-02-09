import { ReadonlyVec2, vec2 } from 'gl-matrix'

interface RayRayIntersectionResult {
    intersects: boolean
    point: vec2
    ua: number
    ub: number
}

export interface LineIntersectionResult {
    intersects: boolean
    point: vec2
}

const rayRayIntersection = (
    result: RayRayIntersectionResult,
    [x1, y1]: ReadonlyVec2,
    [x2, y2]: ReadonlyVec2,
    [x3, y3]: ReadonlyVec2,
    [x4, y4]: ReadonlyVec2
): void => {
    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        result.intersects = false
        return
    }

    const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)

    // Lines are parallel
    if (denominator === 0) {
        result.intersects = false
        return
    }

    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

    // Return a object with the x and y coordinates of the intersection
    const x = x1 + ua * (x2 - x1)
    const y = y1 + ua * (y2 - y1)

    result.intersects = true
    result.point[0] = x
    result.point[1] = y
    result.ua = ua
    result.ub = ub
}

const rayRayResult = { intersects: false, point: vec2.create(), ua: 0, ub: 0 }

export const lineRayIntersection = (
    result: LineIntersectionResult,
    lineP1: ReadonlyVec2,
    lineP2: ReadonlyVec2,
    rayP1: ReadonlyVec2,
    rayP2: ReadonlyVec2
): void => {
    rayRayIntersection(rayRayResult, lineP1, lineP2, rayP1, rayP2)
    if (!rayRayResult.intersects) {
        result.intersects = false
        return
    }
    // is the intersection along the segments
    if (rayRayResult.ua < 0 || rayRayResult.ua > 1) {
        result.intersects = false
        return
    }
    result.intersects = true
    result.point[0] = rayRayResult.point[0]
    result.point[1] = rayRayResult.point[1]
}

export const lineLineIntersection = (
    result: LineIntersectionResult,
    p1: ReadonlyVec2,
    p2: ReadonlyVec2,
    p3: ReadonlyVec2,
    p4: ReadonlyVec2
): void => {
    rayRayIntersection(rayRayResult, p1, p2, p3, p4)
    if (!rayRayResult.intersects) {
        result.intersects = false
        return
    }
    // is the intersection along the segments
    if (rayRayResult.ua < 0 || rayRayResult.ua > 1 || rayRayResult.ub < 0 || rayRayResult.ub > 1) {
        result.intersects = false
        return
    }
    result.intersects = true
    result.point[0] = rayRayResult.point[0]
    result.point[1] = rayRayResult.point[1]
}
