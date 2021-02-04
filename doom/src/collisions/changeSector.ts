import { isStatefulObject } from '../global'
import { Sector } from '../interfaces/Sector'
import { Stateful } from '../interfaces/State'

export const changeSector = (stateful: Stateful, sector: Sector): void => {
    const index = stateful.sector.statefuls.indexOf(stateful)
    stateful.sector.statefuls.splice(index, 1)
    sector.statefuls.push(stateful)
    stateful.sector = sector
    if (isStatefulObject(stateful)) {
        stateful.geometry.position[1] = sector.floorHeight
    }
}
