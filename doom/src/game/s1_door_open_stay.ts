import { Line } from 'doom-map'
import { G } from '../global'
import { ActivationType } from './ActivateLookup'
import { openDoor } from './openDoor'

export const s1_door_open_stay = (type: ActivationType, line: Line) => {
    if (type !== ActivationType.Switch) {
        return
    }

    const {
        map: { sectors }
    } = G

    const sector = sectors.find((s) => s.tag === line.sectorTag)
    if (sector === undefined) {
        console.warn(`Unable to find door sector with tag ${line.sectorTag}`)
        return
    }

    openDoor(sector)
}
