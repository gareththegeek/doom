import { Sector } from 'doom-map'
import { getAdjacentSectors } from '../../getAdjacentSectors'

export const highest_ceiling = (sector: Sector): number =>
    getAdjacentSectors(sector).reduce((a, c) => Math.max(a, c.ceilingHeight), -0x7fff)
