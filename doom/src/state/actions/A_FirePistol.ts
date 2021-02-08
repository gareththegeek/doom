import { isWeapon, Weapon } from '../../interfaces/Weapon'
import { Stateful, StatefulObject } from '../../interfaces/State'
import { createSpriteGeometry } from 'doom-sprite'
import { addToSector } from '../../collisions/addToSector'
import { addStateful } from '../addStateful'
import { getState } from '../getState'

const flash = (weapon: Weapon) => {
    const state = getState(weapon.info.flashstate)
    const flash: StatefulObject = {
        block: undefined,
        sector: weapon.sector,
        state,
        geometry: createSpriteGeometry(state.spriteName)
    }
    flash.geometry.position = [160, 64, 0]
    flash.geometry.screenspace = true
    addStateful(flash)
    addToSector(weapon.sector, flash)
}

export const A_FirePistol = (stateful: Stateful): void => {
    if (!isWeapon(stateful)) {
        console.warn(`Attempted to fire pistol on non-weaopn ${stateful}`)
        return
    }
    
    flash(stateful)
    stateful.ammo -= 1

    //Do the thing
}
