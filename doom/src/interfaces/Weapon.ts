import { isStatefulObject } from '../global'
import { StatefulObject, Stateful } from './State'
import { StateType } from './StateType'

export enum AmmoType {
    Clip
}

export enum WeaponType {
    Pistol
}

export interface WeaponInfo {
    ammoType: AmmoType
    upstate: StateType
    downstate: StateType
    readystate: StateType
    atkstate: StateType
    flashstate: StateType
}

export const WeaponInfoLookup: { [type in WeaponType]: WeaponInfo } = {
    [WeaponType.Pistol]: {
        ammoType: AmmoType.Clip,
        upstate: StateType.S_PISTOLUP,
        downstate: StateType.S_PISTOLDOWN,
        readystate: StateType.S_PISTOL,
        atkstate: StateType.S_PISTOL1,
        flashstate: StateType.S_PISTOLFLASH
    }
}

export interface Weapon extends StatefulObject {
    ammo: number //TODO some weapons share ammo
    info: WeaponInfo
}

export const isWeapon = (stateful: Stateful): stateful is Weapon =>
    isStatefulObject(stateful) && 'ammo' in stateful && 'info' in stateful
