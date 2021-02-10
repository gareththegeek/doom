import { isWeapon, Weapon } from '../../interfaces/Weapon'
import { Stateful } from '../../interfaces/State'
import { addToSector } from '../../collisions/addToSector'
import { addStateful } from '../addStateful'
import { allocateSprite } from '../allocateStateful'
import { G } from '../../global'
import { fireRay } from '../../collisions/fireRay'

const flash = (weapon: Weapon) => {
    const flash = allocateSprite(weapon.info.flashstate)
    flash.sector = weapon.sector
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

    fireRay(G.player)
}
