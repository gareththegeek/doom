import { vec2 } from 'gl-matrix'
import { Thing } from '../interfaces/Thing'

// const turn = (p1: vec2, p2: vec2, p3: vec2): -1 | 0 | 1 => {
//     const a = p1[0]
//     const b = p1[1]
//     const c = p2[0]
//     const d = p2[1]
//     const e = p3[0]
//     const f = p3[1]
//     const A = (f - b) * (c - a)
//     const B = (d - b) * (e - a)
//     return A > B + Number.EPSILON ? 1 : A + Number.EPSILON < B ? -1 : 0
// }

// const isIntersect = (p1: vec2, p2: vec2, p3: vec2, p4: vec2) =>
//     turn(p1, p3, p4) !== turn(p2, p3, p4) && turn(p1, p2, p3) !== turn(p1, p2, p4)

const isIntersecting = (p1: vec2, p2: vec2, p3: vec2, p4: vec2) => {
    const CCW = (p1: vec2, p2: vec2, p3: vec2) => {
        return (p3[1] - p1[1]) * (p2[0] - p1[0]) > (p2[1] - p1[1]) * (p3[0] - p1[0])
    }
    return CCW(p1, p3, p4) != CCW(p2, p3, p4) && CCW(p1, p2, p3) != CCW(p1, p2, p4)
}

const removeThing = (thing: Thing): void => {
    const index = thing.sector.things.indexOf(thing)
    thing.sector.things.splice(index, 1)
}

export const sectorCheck = (thing: Thing, p0: vec2, p1: vec2): boolean => {
    for (let side of thing.sector.sides) {
        if (isIntersecting(p0, p1, side.start, side.end)) {
            if (side.other === undefined) {
                return false
            }
            const next = side.other!.sector
            if (next.floorHeight - thing.sector.floorHeight > 24) {
                return false
            }
            console.log(`Sector ${thing.sector.index} -> ${next.index}`)
            //If side.other is undefined we've hit a wall
            removeThing(thing)
            next.things.push(thing)
            thing.sector = next
            thing.geometry!.position[1] = next.floorHeight
            return true
        }
    }
    return true
}
