import { Sector } from 'doom-map'
import { getAdjacenctSectors } from '../../getAdjacentSectors'

export const highest_ceiling = (sector: Sector): number =>
    getAdjacenctSectors(sector).reduce((a, c) => Math.max(a, c.ceilingHeight), -0x7fff)
