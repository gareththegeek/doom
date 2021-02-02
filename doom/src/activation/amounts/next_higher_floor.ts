import { Sector } from 'doom-map'
import { getAdjacenctSectors } from '../../getAdjacentSectors'
import { highest_floor } from './highest_floor'

export const next_higher_floor = (sector: Sector): number => {
    const adjacent = getAdjacenctSectors(sector)
    if (adjacent.length < 2) {
        return highest_floor(sector)
    }
    return adjacent.map((sector) => sector.floorHeight).sort((a, b) => b - a)[1]
}
