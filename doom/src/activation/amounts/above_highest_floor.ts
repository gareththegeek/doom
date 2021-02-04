import { Sector } from '../../interfaces/Sector'
import { highest_floor } from './highest_floor'

export const above_highest_floor = (sector: Sector, offset: number): number => highest_floor(sector) + offset
