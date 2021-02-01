import { rebuildSectorGeometry, Sector } from 'doom-map'
import { getAdjacenctSectors } from '../getAdjacentSectors'

const DOOR_LIP = 4

export const openDoor = (sector: Sector) => {
    const adjacent = getAdjacenctSectors(sector)
    const target = adjacent.reduce((a, c) => Math.min(a, c.ceilingHeight), 0x7fff) - DOOR_LIP
    const id = setInterval(() => {
        sector.ceilingHeight += 2
        if (sector.ceilingHeight >= target) {
            sector.ceilingHeight = target
            clearInterval(id)
        }
        rebuildSectorGeometry(sector)
        adjacent.forEach((sector) => rebuildSectorGeometry(sector))
    }, 1000 / 35)
}
