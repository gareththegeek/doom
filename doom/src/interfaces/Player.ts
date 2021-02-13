import { Physics } from './State'
import { WeaponType, Weapon } from './Weapon'

export const MAX_PLAYER_SPEED = 400
export const PLAYER_ACCELERATION = 4000
export const MAX_PLAYER_ROTATION = 0.07
export const PLAYER_ANGULAR_ACCELERATION = 1.2
export const PLAYER_ROTATION_DECAY = 0.8

export interface PlayerState {
    weapon: Weapon
    nextWeapon: WeaponType | undefined
    keys: {
        blue: boolean
        red: boolean
        yellow: boolean
    }
}

export interface Player extends Physics {
    playerState: PlayerState
    angularVelocity: number
}
