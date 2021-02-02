import { Sector } from 'doom-map'
import { getAdjacentSectors } from '../../getAdjacentSectors'

export const darkest_adjacent = (sector: Sector): number =>
    getAdjacentSectors(sector).reduce((a, c) => Math.min(a, c.lightLevel), 255)
