import { Line, Sector } from 'doom-map'
import { G } from '../../global'
import { ActivationType } from '../ActivateLookup'
import { d } from './d'

export const d1_yellow = (type: ActivationType, line: Line): Sector | undefined => {
    const {
        player: { keys }
    } = G
    if (!keys.yellow) {
        return undefined
    }
    d(type, line, true)
}
