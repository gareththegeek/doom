import { G } from '../../global'
import { Line, Sector } from '../../interfaces/Sector'
import { ActivationType } from '../ActivateLookup'
import { d } from './d'

export const d1_blue = (type: ActivationType, line: Line): Sector[] => {
    const {
        player: {
            playerState: { keys }
        }
    } = G
    if (!keys.blue) {
        console.info('You need the blue key to open this door')
        return []
    }
    return d(type, line, true)
}
