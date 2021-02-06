import { Sector } from '../../interfaces/Sector'
import { getAdjacentSectors } from '../../getAdjacentSectors'

export const next_higher_floor = (sector: Sector): number => {
    const higher = getAdjacentSectors(sector)
        .filter((adjacent) => adjacent.floorHeight > sector.floorHeight)
        .sort((a, b) => a.floorHeight - b.floorHeight)

    return higher[0].floorHeight
}
