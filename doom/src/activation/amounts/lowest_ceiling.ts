import { Sector } from 'doom-map'
import { getAdjacentSectors } from '../../getAdjacentSectors'

export const lowest_ceiling = (sector: Sector): number =>
    getAdjacentSectors(sector).reduce((a, c) => Math.min(a, c.ceilingHeight), 0x7fff)
