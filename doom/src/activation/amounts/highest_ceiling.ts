import { Sector } from '../../interfaces/Sector'
import { forEachAdjacentSector } from '../../forEachAdjacentSector'

let highest: number

const reduceHighest = (other: Sector): void => {
    if (other.ceilingHeight > highest) {
        highest = other.ceilingHeight
    }
}

export const highest_ceiling = (sector: Sector): number => {
    highest = -0x7fff
    forEachAdjacentSector(sector, reduceHighest)
    return highest
}
