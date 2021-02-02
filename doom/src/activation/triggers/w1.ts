import { Line, Sector } from 'doom-map'
import { G } from '../../global'
import { ActivationType } from '../ActivateLookup'

export const w1 = (type: ActivationType, line: Line): Sector | undefined => {
    if (type !== ActivationType.Walk) {
        return undefined
    }
    line.special = 0

    const {
        map: { sectors }
    } = G

    const sector = sectors.find((s) => s.tag === line.sectorTag)
    if (sector === undefined) {
        console.warn(`Unable to find sector with tag ${line.sectorTag}`)
    }

    return sector
}
