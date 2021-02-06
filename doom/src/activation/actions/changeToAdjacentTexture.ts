import { getAdjacentSectors } from '../../getAdjacentSectors'
import { Sector } from '../../interfaces/Sector'

export const changeToAdjacentSector = (sector: Sector): void => {
    const adjacent = getAdjacentSectors(sector).find((a) => a.floorHeight === sector.floorHeight)
    if (adjacent !== undefined) {
        sector.floorTexture = adjacent.floorTexture
        sector.dirty = true
    }
}
