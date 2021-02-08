import { forEachAdjacentSector } from '../../forEachAdjacentSector'
import { Sector } from '../../interfaces/Sector'

let floorHeight: number
let adjacent: Sector | undefined

const findSameFloorHeight = (other: Sector): void => {
    if (other.floorHeight === floorHeight) {
        adjacent = other
    }
}

export const changeToAdjacentSector = (sector: Sector): void => {
    floorHeight = sector.floorHeight
    adjacent = undefined

    forEachAdjacentSector(sector, findSameFloorHeight)

    if (adjacent !== undefined) {
        sector.floorTexture = adjacent!.floorTexture
        sector.dirty = true
    }
}
