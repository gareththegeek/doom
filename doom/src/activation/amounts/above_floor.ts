import { Sector } from '../../interfaces/Sector'

export const above_floor = (sector: Sector, offset: number): number => sector.floorHeight + offset
