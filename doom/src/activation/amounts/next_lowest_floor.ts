import { Sector } from 'doom-map'
import { getAdjacentSectors } from '../../getAdjacentSectors'
import { highest_floor } from './highest_floor'

export const next_lowest_floor = (sector: Sector): number => {
    const adjacent = getAdjacentSectors(sector)
    if (adjacent.length < 2) {
        return highest_floor(sector)
    }
    return adjacent.map((sector) => sector.floorHeight).sort((a, b) => a - b)[1]
}
