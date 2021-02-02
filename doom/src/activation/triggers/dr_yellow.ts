import { Line, Sector } from 'doom-map'
import { G } from '../../global'
import { ActivationType } from '../ActivateLookup'
import { d } from './d'

export const dr_yellow = (type: ActivationType, line: Line): Sector[] => {
    const {
        player: { keys }
    } = G
    if (!keys.yellow) {
        console.info('You need the yellow key to open this door')
        return []
    }
    return d(type, line, false)
}
