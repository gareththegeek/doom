import { Line, Sector } from 'doom-map'
import { ActivationType } from '../ActivateLookup'

export const d = (type: ActivationType, line: Line, once: boolean): Sector | undefined => {
    if (type !== ActivationType.Switch) {
        return undefined
    }
    if (once) {
        line.special = 0
    }

    const sector = line.back?.sector
    if (sector === undefined) {
        console.warn(`Unable to find door sector`)
    }

    return sector
}
