import { StatefulObject, StatefulThing } from './State'

export enum WeaponType {
    Pistol
}

export interface Weapon extends StatefulObject {
    ammo: number //TODO some weapons share ammo
    ready: boolean
}

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
