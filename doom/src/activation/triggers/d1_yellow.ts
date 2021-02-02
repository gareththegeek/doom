import { Line, Sector } from 'doom-map'
import { G } from '../../global'
import { ActivationType } from '../ActivateLookup'
import { d } from './d'

export const d1_yellow = (type: ActivationType, line: Line): Sector | undefined => {
    const {
        player: { keys }
    } = G
    if (!keys.yellow) {
        console.info('You need the yellow key to open this door')
        return undefined
    }
    return d(type, line, true)
}
