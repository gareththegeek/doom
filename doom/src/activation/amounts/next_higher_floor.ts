import { Sector } from '../../interfaces/Sector'
import { forEachAdjacentSector } from '../../forEachAdjacentSector'

let highest: number
let thisSector: Sector

const reduceNextHighest = (other: Sector): void => {
    if (other.floorHeight < highest && other.floorHeight > thisSector.floorHeight) {
        highest = other.floorHeight
    }
}

export const next_higher_floor = (sector: Sector): number => {
    thisSector = sector
    highest = 0x7fff
    forEachAdjacentSector(thisSector, reduceNextHighest)
    if (highest === 0x7fff) {
        highest = thisSector.floorHeight
    }
    return highest
}
