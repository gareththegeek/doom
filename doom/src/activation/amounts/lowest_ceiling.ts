import { Sector } from '../../interfaces/Sector'
import { forEachAdjacentSector } from '../../forEachAdjacentSector'

let lowest: number

const reduceLowest = (other: Sector): void => {
    if (other.ceilingHeight < lowest) {
        lowest = other.ceilingHeight
    }
}

export const lowest_ceiling = (sector: Sector): number => {
    lowest = 0x7fff
    forEachAdjacentSector(sector, reduceLowest)
    return lowest
}
