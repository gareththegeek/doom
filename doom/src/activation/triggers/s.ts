import { Line, Sector } from 'doom-map'
import { ActivationType } from '../ActivateLookup'
import { getTaggedSectors } from './getTaggedSectors'

export const s = (type: ActivationType, line: Line, once: boolean): Sector[] => {
    if (type !== ActivationType.Switch) {
        return []
    }
    if (once) {
        line.special = 0
    }
    return getTaggedSectors(line.sectorTag)
}
