import { Line } from 'doom-map'
import { ActivationType } from './ActivateLookup'
import { openDoor } from './openDoor'

export const d1_door_open_stay = (type: ActivationType, line: Line) => {
    if (type !== ActivationType.Switch) {
        return
    }

    const sector = line.back?.sector
    if (sector === undefined) {
        console.warn(`Unable to find door sector`)
        return
    }

    openDoor(sector)
}
