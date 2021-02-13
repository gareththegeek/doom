import { changeSprite, getSpriteHeight } from 'doom-sprite'
import { G } from '../../global'
import { Stateful } from '../../interfaces/State'
import { isWeapon, WeaponInfoLookup } from '../../interfaces/Weapon'
import { setState } from '../setState'

const WEAPON_LOWER_SPEED = 8

export const A_Lower = (stateful: Stateful): void => {
    if (!isWeapon(stateful)) {
        return
    }

    stateful.geometry.position[1] -= WEAPON_LOWER_SPEED

    const height = getSpriteHeight(stateful.state.spriteName, stateful.state.frame)
    if (stateful.geometry.position[1] <= -height) {
        const {
            player: { playerState }
        } = G
        stateful.info = WeaponInfoLookup[playerState.nextWeapon!]
        setState(stateful, stateful.info.upstate)
        changeSprite(stateful.geometry, stateful.state.spriteName)
        const newHeight = getSpriteHeight(stateful.state.spriteName, stateful.state.frame)
        stateful.geometry.position[1] = -newHeight
    }
}
