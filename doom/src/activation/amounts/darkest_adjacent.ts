import { Sector } from '../../interfaces/Sector'
import { forEachAdjacentSector } from '../../forEachAdjacentSector'

let darkest: number

const reduceDarkest = (other: Sector): void => {
    if (other.lightLevel < darkest) {
        darkest = other.lightLevel
    }
}

export const darkest_adjacent = (sector: Sector): number => {
    darkest = 255
    forEachAdjacentSector(sector, reduceDarkest)
    return darkest
}
