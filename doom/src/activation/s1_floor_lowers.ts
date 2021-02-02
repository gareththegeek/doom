import { Line } from 'doom-map'
import { G } from '../global'
import { ActivationType } from './ActivateLookup'
import { lowerFloor } from './lowerFloor'

export const s1_floor_lowers = (type: ActivationType, line: Line) => {
    if (type !== ActivationType.Switch) {
        return
    }

    const {
        map: { sectors }
    } = G

    const sector = sectors.find((s) => s.tag === line.sectorTag)
    if (sector === undefined) {
        console.warn(`Unable to find sector with tag ${line.sectorTag}`)
        return
    }

    lowerFloor(sector)
}
