import { Line, Sector } from '../../interfaces/Sector'
import { ActivationType } from '../ActivateLookup'
import { getTaggedSectors } from './getTaggedSectors'

export const w = (type: ActivationType, line: Line, once: boolean): Sector[] => {
    if (type !== ActivationType.Walk) {
        return []
    }
    if (once) {
        line.special = 0
    }

    return getTaggedSectors(line.sectorTag)
}
