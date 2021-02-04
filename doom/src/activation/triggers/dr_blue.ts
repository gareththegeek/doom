import { Line, Sector } from '../../interfaces/Sector'
import { G } from '../../global'
import { ActivationType } from '../ActivateLookup'
import { d } from './d'

export const dr_blue = (type: ActivationType, line: Line): Sector[] => {
    const {
        player: {
            playerState: { keys }
        }
    } = G
    if (!keys.blue) {
        console.info('You need the blue key to open this door')
        return []
    }
    return d(type, line, false)
}
