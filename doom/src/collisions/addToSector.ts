import { isStatefulObject } from '../global'
import { Sector } from '../interfaces/Sector'
import { Stateful } from '../interfaces/State'

export const addToSector = (sector: Sector, stateful: Stateful): void => {
    if (sector === undefined) {
        return
    }
    if (stateful === undefined) {
        return
    }

    sector.statefuls.add(stateful)
    stateful.sector = sector

    if (isStatefulObject(stateful)) {
        stateful.geometry.light = sector.lightLevel
        if (!stateful.geometry.screenspace) {
            stateful.geometry.position[1] = sector.floorHeight
        }
    }
}
