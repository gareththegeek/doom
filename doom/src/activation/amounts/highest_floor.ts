import { Sector } from '../../interfaces/Sector'
import { forEachAdjacentSector } from '../../forEachAdjacentSector'

let highest: number

const reduceHighest = (sector: Sector) => {
    highest = Math.max(highest, sector.floorHeight)
}

export const highest_floor = (sector: Sector): number => {
    highest = -0x7fff
    forEachAdjacentSector(sector, reduceHighest)
    return highest
}
