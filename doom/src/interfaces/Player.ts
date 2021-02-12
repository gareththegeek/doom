import { Physics } from './State'
import { WeaponType, Weapon } from './Weapon'

export const MAX_PLAYER_SPEED = 400
export const PLAYER_ACCELERATION = 4000

export interface PlayerState {
    weapons: { [type in WeaponType]: Weapon }
    currentWeapon: Weapon
    nextWeapon: Weapon | undefined
    keys: {
        blue: boolean
        red: boolean
        yellow: boolean
    }
}

export interface Player extends Physics {
    playerState: PlayerState
}
