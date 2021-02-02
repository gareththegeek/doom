import { Sector } from 'doom-map'
import { getAdjacenctSectors } from '../getAdjacentSectors'

const DOOR_LIP = 4

export const openDoor = (sector: Sector) => {
    sector.update = (() => {
        const adjacent = getAdjacenctSectors(sector)
        const target = adjacent.reduce((a, c) => Math.min(a, c.ceilingHeight), 0x7fff) - DOOR_LIP
        return (deltaTime: number) => {
            sector.ceilingHeight += 70 * deltaTime
            if (sector.ceilingHeight >= target) {
                sector.ceilingHeight = target
                sector.update = undefined
            }
        }
    })()
}
