import { Sector } from '../../interfaces/Sector'
import { getAdjacentSectors } from '../../getAdjacentSectors'

export const shortest_lower_texture = (sector: Sector): number => {
    //TODO no idea if this is what this means?
    return getAdjacentSectors(sector).reduce((a, c) => Math.min(a, Math.abs(c.floorHeight - sector.floorHeight)), 0)
}
