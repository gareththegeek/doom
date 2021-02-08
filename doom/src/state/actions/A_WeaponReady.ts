import { G } from '../../global'
import { isWeapon } from '../../interfaces/Weapon'
import { Stateful } from '../../interfaces/State'
import { getState } from '../getState'

export const A_WeaponReady = (stateful: Stateful): void => {
    if (!isWeapon(stateful)) {
        console.warn(`Attempted to weapon ready on non-weaopn ${stateful}`)
        return
    }

    const {
        input: { isPressed }
    } = G

    if (!isPressed['Control']) {
        return
    }
    if (stateful.ammo === 0) {
        return
    }

    stateful.state = getState(stateful.info.atkstate)
}
