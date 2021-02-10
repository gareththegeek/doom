import { Sector } from '../../interfaces/Sector'
import { forEachAdjacentSector } from '../../forEachAdjacentSector'

let lowest: number
let thisSector: Sector

const reduceNextLowest = (other: Sector): void => {
    if (other.floorHeight < lowest && other.floorHeight > thisSector.floorHeight) {
        lowest = other.floorHeight
    }
}

export const next_lowest_floor = (sector: Sector): number => {
    thisSector = sector
    lowest = 0x7fff
    forEachAdjacentSector(thisSector, reduceNextLowest)
    if ((lowest === 0x7fff)) {
        lowest = thisSector.floorHeight
    }
    return lowest
}
