import { vec2 } from 'gl-matrix'

interface RayRayIntersectionResult {
    point: vec2
    ua: number
    ub: number
}

const rayRayIntersection = (
    [x1, y1]: vec2,
    [x2, y2]: vec2,
    [x3, y3]: vec2,
    [x4, y4]: vec2
): RayRayIntersectionResult | undefined => {
    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return undefined
    }

    const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)

    // Lines are parallel
    if (denominator === 0) {
        return undefined
    }

    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

    // Return a object with the x and y coordinates of the intersection
    const x = x1 + ua * (x2 - x1)
    const y = y1 + ua * (y2 - y1)

    return {
        point: [x, y],
        ua,
        ub
    }
}

export const lineRayIntersection = (lineP1: vec2, lineP2: vec2, rayP1: vec2, rayP2: vec2): vec2 | undefined => {
    const result = rayRayIntersection(lineP1, lineP2, rayP1, rayP2)
    if (result !== undefined) {
        // is the intersection along the segments
        if (result.ua < 0 || result.ua > 1) {
            return undefined
        }
    }
    return result?.point
}

export const lineLineIntersection = (p1: vec2, p2: vec2, p3: vec2, p4: vec2): vec2 | undefined => {
    const result = rayRayIntersection(p1, p2, p3, p4)
    if (result !== undefined) {
        // is the intersection along the segments
        if (result.ua < 0 || result.ua > 1 || result.ub < 0 || result.ub > 1) {
            return undefined
        }
    }
    return result?.point
}
