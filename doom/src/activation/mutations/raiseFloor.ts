import { Sector } from 'doom-map'
import { moveFloor } from './moveFloor'

export const raiseFloor = async (sector: Sector, targetHeight: number, speed = 70): Promise<boolean> =>
    moveFloor(sector, targetHeight, speed)
