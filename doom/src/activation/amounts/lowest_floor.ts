import { Sector } from '../../interfaces/Sector'
import { forEachAdjacentSector } from '../../forEachAdjacentSector'

let lowest: number

const reduceLowest = (other: Sector): void => {
    if (other.floorHeight < lowest) {
        lowest = other.floorHeight
    }
}

export const lowest_floor = (sector: Sector): number => {
    lowest = 0x7fff
    forEachAdjacentSector(sector, reduceLowest)
    return lowest
}
