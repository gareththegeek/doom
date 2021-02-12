import { Sector } from '../interfaces/Sector'
import { Stateful } from '../interfaces/State'
import { addToSector } from './addToSector'
import { removeFromSector } from './removeFromSector'

export const changeSector = (stateful: Stateful, sector: Sector): void => {
    removeFromSector(stateful)
    const touchingFloor = sector.floorHeight >= stateful.geometry.position[1]
    addToSector(sector, stateful, touchingFloor)
}
