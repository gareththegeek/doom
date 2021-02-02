import { Line, Sector } from 'doom-map'
import { G } from '../../global'
import { ActivationType } from '../ActivateLookup'
import { d } from './d'

export const d1_blue = (type: ActivationType, line: Line): Sector[] => {
    const {
        player: { keys }
    } = G
    if (!keys.blue) {
        console.info('You need the blue key to open this door')
        return []
    }
    return d(type, line, true)
}
