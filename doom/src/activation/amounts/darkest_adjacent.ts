import { Sector } from 'doom-map'
import { getAdjacenctSectors } from '../../getAdjacentSectors'

export const darkest_adjacent = (sector: Sector): number =>
    getAdjacenctSectors(sector).reduce((a, c) => Math.min(a, c.lightLevel), 255)
