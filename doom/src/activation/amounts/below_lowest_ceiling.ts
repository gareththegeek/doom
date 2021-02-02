import { Sector } from 'doom-map'
import { lowest_ceiling } from './lowest_ceiling'

export const below_lowest_ceiling = (sector: Sector, offset: number): number => lowest_ceiling(sector) - offset
