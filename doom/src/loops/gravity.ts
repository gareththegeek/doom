import { forEachLinkedList } from 'low-mem'
import { isStatefulObject } from '../global'
import { Sector } from '../interfaces/Sector'
import { Stateful } from '../interfaces/State'

let currentSector: Sector

const applyGravity = (stateful: Stateful): void => {
    if (!isStatefulObject(stateful)) {
        return
    }
    //TODO falling rather than being glued to the floor
    stateful.geometry.position[1] = currentSector.floorHeight
}

export const doGravity = (sector: Sector): void => {
    currentSector = sector
    forEachLinkedList(sector.statefuls, applyGravity)
}
