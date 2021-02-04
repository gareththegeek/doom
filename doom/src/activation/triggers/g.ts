import { Line, Sector } from '../../interfaces/Sector'
import { G } from '../../global'
import { ActivationType } from '../ActivateLookup'

export const g = (type: ActivationType, line: Line, once: boolean): Sector[] => {
    if (type !== ActivationType.Gun) {
        return []
    }
    if (once) {
        line.special = 0
    }

    const { sectors } = G

    const sector = sectors.find((s) => s.tag === line.sectorTag)
    if (sector === undefined) {
        console.warn(`Unable to find sector with tag ${line.sectorTag}`)
        return []
    }

    return [sector]
}
