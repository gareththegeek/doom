import { Sector } from 'doom-map'
import { lowest_ceiling } from '../amounts'
import { moveCeiling } from './moveCeiling'

const DOOR_LIP = 4

export const openDoor = (sector: Sector, speed: number): Promise<boolean> =>
    moveCeiling(sector, lowest_ceiling(sector) - DOOR_LIP, speed)
