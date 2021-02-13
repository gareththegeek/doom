import { Stateful } from '../../interfaces/State'
import { isWeapon } from '../../interfaces/Weapon'
import { setState } from '../setState'

const WEAPON_RAISE_SPEED = 8

export const A_Raise = (stateful: Stateful): void => {
    if (!isWeapon(stateful)) {
        return
    }

    const {
        geometry: { position }
    } = stateful

    position[1] += WEAPON_RAISE_SPEED

    if (position[1] >= 0) {
        position[1] = 0
        setState(stateful, stateful.info.readystate)
    }
}
