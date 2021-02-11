import { vec2 } from 'gl-matrix'
import { Line } from '../interfaces/Sector'
import { StatefulObjectThing, StatefulThing } from '../interfaces/State'
import { findLineSideForPoint, LineSideResult } from '../maths/findLineSideForPoint'
import { Intersection } from './collisionCheck'

const lineSideResult = {} as LineSideResult
const p0 = vec2.create()
export const isSolidForThing = (actor: StatefulObjectThing, intersection: Intersection): boolean => {
    if (!intersection.isLine) {
        const thing = intersection.collider as StatefulThing
        return thing.info.flags.solid
    }

    const line = intersection.collider as Line

    if (line.back === undefined) {
        return true
    }
    if (line.flags.blocks) {
        return true
    }

    p0[0] = actor.geometry.position[0]
    p0[1] = actor.geometry.position[2]
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
    if (other.sector.ceilingHeight - other.sector.floorHeight < actor.info.height) {
        return true
    }
    if (other.sector.ceilingHeight - side.sector.floorHeight < actor.info.height) {
        return true
    }
    return false
}
