import { Sector } from 'doom-map'
import { getAdjacenctSectors } from '../getAdjacentSectors'

export const lowerFloor = (sector: Sector) => {
    sector.update = (() => {
        const adjacent = getAdjacenctSectors(sector)
        const target = adjacent
            .filter((a) => a.floorHeight < sector.floorHeight)
            .reduce((a, c) => Math.max(a, c.floorHeight), -0x7fff)

        return (deltaTime: number) => {
            sector.floorHeight -= 70 * deltaTime
            if (sector.floorHeight <= target) {
                sector.floorHeight = target
                sector.update = undefined
            }
        }
    })()
}
