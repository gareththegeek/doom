import { rebuildSectorGeometry, Sector } from 'doom-map'
import { getAdjacenctSectors } from '../getAdjacentSectors'

export const lowerFloor = (sector: Sector) => {
    const adjacent = getAdjacenctSectors(sector)
    const target = adjacent
        .filter((a) => a.floorHeight < sector.floorHeight)
        .reduce((a, c) => Math.max(a, c.floorHeight), -0x7fff)

    const id = setInterval(() => {
        sector.floorHeight -= 2
        if (sector.floorHeight <= target) {
            sector.floorHeight = target
            clearInterval(id)
        }
        rebuildSectorGeometry(sector)
        adjacent.forEach((sector) => rebuildSectorGeometry(sector))
    }, 1000 / 35)
}
