import { Sector } from 'doom-map'
import { getAdjacenctSectors } from '../../getAdjacentSectors'

export const highest_floor = (sector: Sector): number =>
    getAdjacenctSectors(sector).reduce((a, c) => Math.max(a, c.floorHeight), -0x7fff)
