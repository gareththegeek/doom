import { Line, Sector } from 'doom-map'
import { G } from '../../global'
import { ActivationType } from '../ActivateLookup'
import { d } from './d'

export const dr_red = (type: ActivationType, line: Line): Sector[] => {
    const {
        player: { keys }
    } = G
    if (!keys.red) {
        console.info('You need the red key to open this door')
        return []
    }
    return d(type, line, false)
}
