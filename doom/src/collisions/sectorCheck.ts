import { vec2 } from 'gl-matrix'
import { Line } from '../interfaces/Line'
import { Sector } from '../interfaces/Sector'
import { Thing } from '../interfaces/Thing'
import { findLineSideForPoint } from '../maths/findLineSideForPoint'
import { lineLineIntersection } from '../maths/lineLineIntersection'

const changeSector = (thing: Thing, sector: Sector): void => {
    const index = thing.sector.things.indexOf(thing)
    thing.sector.things.splice(index, 1)
    sector.things.push(thing)
    thing.sector = sector
    thing.geometry!.position[1] = sector.floorHeight
}

export const sectorCheck = (lines: Line[], thing: Thing, p0: vec2, p1: vec2): void => {
    //TODO check if _centre_ of thing has intersected the lines
    // for all intersected lines find furthest intersection from p0
    // move thing to new sector (on far side of furthest intersected line)
    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i]
        // Lines are sorted from closest to farthest - work backwards to find the furthest line crossing
        if (lineLineIntersection(p0, p1, line.start, line.end)) {
            const { side } = findLineSideForPoint(line, p1)
            if (side === undefined) {
                // I think this can't happen but we'll see
                console.warn(`Missing side in sector check side:${side}`)
                continue
            }
            changeSector(thing, side.sector)
        }
    }
}
