import { Line, Sector } from 'doom-map'
import { G } from '../../global'
import { ActivationType } from '../ActivateLookup'
import { d } from './d'

export const dr_blue = (type: ActivationType, line: Line): Sector | undefined => {
    const {
        player: { keys }
    } = G
    if (!keys.blue) {
        console.info('You need the blue key to open this door')
        return undefined
    }
    return d(type, line, false)
}
