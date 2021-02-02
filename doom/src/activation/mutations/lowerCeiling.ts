import { Sector } from 'doom-map'
import { moveCeiling } from './moveCeiling'

export const lowerCeiling = async (sector: Sector, targetHeight: number): Promise<boolean> =>
    moveCeiling(sector, targetHeight, -70)
