import { Sector } from 'doom-map'
import { getAdjacenctSectors } from '../../getAdjacentSectors'

export const lowest_floor = (sector: Sector): number =>
    getAdjacenctSectors(sector).reduce((a, c) => Math.min(a, c.floorHeight), 0x7fff)
