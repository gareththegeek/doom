import { playSound } from 'doom-audio'
import { G } from '../../global'
import { Stateful } from '../../interfaces/State'
import { isWeapon } from '../../interfaces/Weapon'
import { setState } from '../setState'

export const A_ReFire = (stateful: Stateful): void => {
    if (!isWeapon(stateful)) {
        return
    }

    const {
        input: { isPressed }
    } = G

    if (stateful.ammo === 0) {
        return
    }

    if (isPressed['Control']) {
        setState(stateful, stateful.info.atkstate)
    
        playSound('dspistol')
    }
}
