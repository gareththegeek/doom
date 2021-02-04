import { Sector } from '../../interfaces/Sector'
import { moveCeiling } from './moveCeiling'

export const raiseCeiling = async (sector: Sector, targetHeight: number): Promise<boolean> =>
    moveCeiling(sector, targetHeight, 70)
