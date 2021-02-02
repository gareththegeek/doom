import { Sector } from 'doom-map'
import { getAdjacenctSectors } from '../../getAdjacentSectors'

export const brightest_adjacent = (sector: Sector): number =>
    getAdjacenctSectors(sector).reduce((a, c) => Math.max(a, c.lightLevel), 0)
