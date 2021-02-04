import { Sector } from '../../interfaces/Sector'
import { highest_floor } from '../amounts'
import { moveCeiling } from './moveCeiling'

export const closeDoor = (sector: Sector, speed: number): Promise<boolean> =>
    moveCeiling(sector, highest_floor(sector), -speed)
