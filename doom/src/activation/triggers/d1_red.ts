import { Line, Sector } from '../../interfaces/Sector'
import { G } from '../../global'
import { ActivationType } from '../ActivateLookup'
import { d } from './d'

export const d1_red = (type: ActivationType, line: Line): Sector[] => {
    const {
        player: {
            playerState: { keys }
        }
    } = G
    if (!keys.red) {
        console.info('You need the red key to open this door')
        return []
    }
    return d(type, line, true)
}
