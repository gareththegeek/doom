import { isStatefulObject } from '../global'
import { StatefulObject, StatefulThing } from './State'
import { WeaponType, Weapon } from './Weapon'

export interface PlayerState {
    weapons: { [type in WeaponType]: Weapon }
    currentWeapon: StatefulObject
    nextWeapon: StatefulObject | undefined
    keys: {
        blue: boolean
        red: boolean
        yellow: boolean
    }
}

export interface Player extends StatefulThing, StatefulObject {
    playerState: PlayerState
}
