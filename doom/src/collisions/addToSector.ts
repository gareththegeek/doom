import { Sector } from '../interfaces/Sector'
import { Stateful } from '../interfaces/State'

export const addToSector = (sector: Sector, stateful: Stateful, setHeight = false): void => {
    if (sector === undefined) {
        return
    }
    if (stateful === undefined) {
        return
    }

    sector.statefuls.add(stateful)
    stateful.sector = sector

    stateful.geometry.light = sector.lightLevel
    if (setHeight && !stateful.geometry.screenspace) {
        stateful.geometry.position[1] = sector.floorHeight
    }
}
