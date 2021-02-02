import { Line, Sector } from 'doom-map'
import { ActivationType } from '../ActivateLookup'

export const d1 = (type: ActivationType, line: Line): Sector | undefined => {
    if (type !== ActivationType.Switch) {
        return undefined
    }
    line.special = 0

    const sector = line.back?.sector
    if (sector === undefined) {
        console.warn(`Unable to find door sector`)
    }

    return sector
}
