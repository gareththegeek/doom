import { Sector } from 'doom-map'
import { getAdjacenctSectors } from '../../getAdjacentSectors'

export const lowest_ceiling = (sector: Sector): number =>
    getAdjacenctSectors(sector).reduce((a, c) => Math.min(a, c.ceilingHeight), 0x7fff)
