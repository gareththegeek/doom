import { Sector } from 'doom-map'
import { getAdjacentSectors } from '../../getAdjacentSectors'

export const lowest_floor = (sector: Sector): number =>
    getAdjacentSectors(sector).reduce((a, c) => Math.min(a, c.floorHeight), 0x7fff)
