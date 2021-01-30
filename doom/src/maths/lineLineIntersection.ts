import { vec2 } from 'gl-matrix'

export const lineLineIntersection = (p1: vec2, p2: vec2, p3: vec2, p4: vec2): boolean => {
    const CCW = (p1: vec2, p2: vec2, p3: vec2) => {
        return (p3[1] - p1[1]) * (p2[0] - p1[0]) > (p2[1] - p1[1]) * (p3[0] - p1[0])
    }
    return CCW(p1, p3, p4) != CCW(p2, p3, p4) && CCW(p1, p2, p3) != CCW(p1, p2, p4)
}
