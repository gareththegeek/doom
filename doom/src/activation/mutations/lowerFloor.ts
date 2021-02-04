import { Sector } from '../../interfaces/Sector'
import { moveFloor } from './moveFloor'

export const lowerFloor = async (sector: Sector, targetHeight: number, speed = 70): Promise<boolean> =>
    moveFloor(sector, targetHeight, -speed)
