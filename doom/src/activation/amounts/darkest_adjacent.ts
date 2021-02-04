import { Sector } from '../../interfaces/Sector'
import { getAdjacentSectors } from '../../getAdjacentSectors'

export const darkest_adjacent = (sector: Sector): number =>
    getAdjacentSectors(sector).reduce((a, c) => Math.min(a, c.lightLevel), 255)
