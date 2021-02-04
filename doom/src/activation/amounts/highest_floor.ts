import { Sector } from '../../interfaces/Sector'
import { getAdjacentSectors } from '../../getAdjacentSectors'

export const highest_floor = (sector: Sector): number =>
    getAdjacentSectors(sector).reduce((a, c) => Math.max(a, c.floorHeight), -0x7fff)
