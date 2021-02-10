import { forEachLinkedList } from 'low-mem'
import { isStatefulObject } from '../../global'
import { Sector } from '../../interfaces/Sector'
import { Stateful } from '../../interfaces/State'

let light: number
const setLight = (stateful: Stateful): void => {
    if (isStatefulObject(stateful)) {
        stateful.geometry.light = light
    }
}

export const light_change_to = (sector: Sector, amount: number) => {
    light = amount
    sector.lightLevel = light
    sector.geometry!.light = light
    forEachLinkedList(sector.statefuls, setLight)
}
