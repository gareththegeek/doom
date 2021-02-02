import { Line, Sector } from 'doom-map'
import { G } from '../../global'
import { ActivationType } from '../ActivateLookup'
import { d } from './d'

export const d1_red = (type: ActivationType, line: Line): Sector | undefined => {
    const {
        player: { keys }
    } = G
    if (!keys.red) {
        console.info('You need the red key to open this door')
        return undefined
    }
    return d(type, line, true)
}
