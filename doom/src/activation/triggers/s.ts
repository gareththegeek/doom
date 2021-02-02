import { Line, Sector } from 'doom-map'
import { G } from '../../global'
import { ActivationType } from '../ActivateLookup'

export const s = (type: ActivationType, line: Line, once: boolean): Sector | undefined => {
    if (type !== ActivationType.Switch) {
        return undefined
    }
    if (once) {
        line.special = 0
    }

    const {
        map: { sectors }
    } = G

    const sector = sectors.find((s) => s.tag === line.sectorTag)
    if (sector === undefined) {
        console.warn(`Unable to find sector with tag ${line.sectorTag}`)
    }

    return sector
}
