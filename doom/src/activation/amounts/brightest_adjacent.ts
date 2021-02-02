import { Sector } from 'doom-map'
import { getAdjacentSectors } from '../../getAdjacentSectors'

export const brightest_adjacent = (sector: Sector): number =>
    getAdjacentSectors(sector).reduce((a, c) => Math.max(a, c.lightLevel), 0)
