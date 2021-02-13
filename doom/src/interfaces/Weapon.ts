import { Stateful } from './State'
import { StateType } from './StateType'

export enum AmmoType {
    NoAmmo = 0,
    Clip,
    Shell,
    Missile,
    Cell
}

export enum WeaponType {
    Fist = 0,
    Chainsaw,
    Pistol,
    Shotgun,
    SuperShotgun,
    Chaingun,
    MissileLauncher,
    PlasmaRifle,
    Bfg
}

export interface WeaponInfo {
    type: WeaponType
    ammoType: AmmoType
    upstate: StateType
    downstate: StateType
    readystate: StateType
    atkstate: StateType
    flashstate: StateType
}

export const WeaponInfoLookup: { [type in WeaponType]: WeaponInfo } = {
    [WeaponType.Fist]: {
        type: WeaponType.Fist,
        ammoType: AmmoType.NoAmmo,
        upstate: StateType.S_PUNCHUP,
        downstate: StateType.S_PUNCHDOWN,
        readystate: StateType.S_PUNCH,
        atkstate: StateType.S_PUNCH1,
        flashstate: StateType.S_NULL
    },
    [WeaponType.Chainsaw]: {
        type: WeaponType.Chainsaw,
        ammoType: AmmoType.NoAmmo,
        upstate: StateType.S_SAWUP,
        downstate: StateType.S_SAWDOWN,
        readystate: StateType.S_SAW,
        atkstate: StateType.S_SAW1,
        flashstate: StateType.S_NULL
    },
    [WeaponType.Pistol]: {
        type: WeaponType.Pistol,
        ammoType: AmmoType.Clip,
        upstate: StateType.S_PISTOLUP,
        downstate: StateType.S_PISTOLDOWN,
        readystate: StateType.S_PISTOL,
        atkstate: StateType.S_PISTOL1,
        flashstate: StateType.S_PISTOLFLASH
    },
    [WeaponType.Shotgun]: {
        type: WeaponType.Shotgun,
        ammoType: AmmoType.Shell,
        upstate: StateType.S_SGUNUP,
        downstate: StateType.S_SGUNDOWN,
        readystate: StateType.S_SGUN,
        atkstate: StateType.S_SGUN1,
        flashstate: StateType.S_SGUNFLASH1
    },
    [WeaponType.SuperShotgun]: {
        type: WeaponType.SuperShotgun,
        ammoType: AmmoType.Shell,
        upstate: StateType.S_DSGUNUP,
        downstate: StateType.S_DSGUNDOWN,
        readystate: StateType.S_DSGUN,
        atkstate: StateType.S_DSGUN1,
        flashstate: StateType.S_DSGUNFLASH1
    },
    [WeaponType.Chaingun]: {
        type: WeaponType.Chaingun,
        ammoType: AmmoType.Clip,
        upstate: StateType.S_CHAINUP,
        downstate: StateType.S_CHAINDOWN,
        readystate: StateType.S_CHAIN,
        atkstate: StateType.S_CHAIN1,
        flashstate: StateType.S_CHAINFLASH1
    },
    [WeaponType.MissileLauncher]: {
        type: WeaponType.MissileLauncher,
        ammoType: AmmoType.Missile,
        upstate: StateType.S_MISSILEUP,
        downstate: StateType.S_MISSILEDOWN,
        readystate: StateType.S_MISSILE,
        atkstate: StateType.S_MISSILE1,
        flashstate: StateType.S_MISSILEFLASH1
    },
    [WeaponType.PlasmaRifle]: {
        type: WeaponType.PlasmaRifle,
        ammoType: AmmoType.Cell,
        upstate: StateType.S_PLASMAUP,
        downstate: StateType.S_PLASMADOWN,
        readystate: StateType.S_PLASMA,
        atkstate: StateType.S_PLASMA1,
        flashstate: StateType.S_PLASMAFLASH1
    },
    [WeaponType.Bfg]: {
        type: WeaponType.Bfg,
        ammoType: AmmoType.Cell,
        upstate: StateType.S_BFGUP,
        downstate: StateType.S_BFGDOWN,
        readystate: StateType.S_BFG,
        atkstate: StateType.S_BFG1,
        flashstate: StateType.S_BFGFLASH1
    }
}

export interface Weapon extends Stateful {
    ammo: number //TODO some weapons share ammo
    info: WeaponInfo
}

export const isWeapon = (stateful: Stateful): stateful is Weapon => 'ammo' in stateful
