import { Sector } from 'doom-map'

export const above_floor = (sector: Sector, offset: number): number => sector.floorHeight + offset