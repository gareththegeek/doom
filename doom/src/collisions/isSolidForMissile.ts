import { Line } from '../interfaces/Sector'
import { Physics } from '../interfaces/State'
import { Intersection } from './collisionCheck'

export const isSolidForMissile = (_: Physics, intersection: Intersection): boolean => {
    if (!intersection.isLine) {
        const thing = intersection.collider as Physics
        return thing.info.flags.solid
    }

    const line = intersection.collider as Line
    if (line.back === undefined) {
        return true
    }

    if (line.back.sector.ceilingHeight === line.back.sector.floorHeight) {
        return true
    }

    if (line.front.sector.ceilingHeight === line.front.sector.floorHeight) {
        return true
    }

    if (line.front.sector.ceilingHeight === line.back.sector.floorHeight) {
        return true
    }

    if (line.back.sector.ceilingHeight === line.front.sector.floorHeight) {
        return true
    }

    return false
}
