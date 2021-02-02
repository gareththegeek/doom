import { Line, Sector } from 'doom-map'
import { G } from '../../global'
import { ActivationType } from '../ActivateLookup'

export const s = (type: ActivationType, line: Line, once: boolean): Sector[] => {
    if (type !== ActivationType.Switch) {
        return []
    }
    if (once) {
        line.special = 0
    }

    const {
        map: { sectors }
    } = G

    const tagged = sectors.filter((s) => s.tag === line.sectorTag)
    if (tagged.length === 0) {
        console.warn(`Unable to find sector with tag ${line.sectorTag}`)
    }

    return tagged
}
