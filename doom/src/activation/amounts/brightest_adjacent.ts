import { Sector } from '../../interfaces/Sector'
import { forEachAdjacentSector } from '../../forEachAdjacentSector'

let brightest: number

const reduceBrightest = (other: Sector): void => {
    if (other.lightLevel > brightest) {
        brightest = other.lightLevel
    }
}

export const brightest_adjacent = (sector: Sector): number => {
    brightest = 0
    forEachAdjacentSector(sector, reduceBrightest)
    return brightest
}
