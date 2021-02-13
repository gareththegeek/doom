import PubSub from 'pubsub-js'
import { G } from '../global'
import { ON_KEY_DOWN } from '../interfaces/messageTypes'
import { WeaponType } from '../interfaces/Weapon'
import { setState } from '../state/setState'

const weaponChange = (_: string, key: string): void => {
    if (key < '1' || key > '7') {
        return
    }
    const {
        player: { playerState }
    } = G

    let nextWeapon: WeaponType
    switch (key) {
        case '1': {
            if (playerState.weapon.info.type === WeaponType.Chainsaw) {
                nextWeapon = WeaponType.Fist
            } else {
                nextWeapon = WeaponType.Chainsaw
            }
            break
        }
        case '2': {
            nextWeapon = WeaponType.Pistol
            break
        }
        case '3': {
            nextWeapon = WeaponType.Shotgun
            break
        }
        case '4': {
            nextWeapon = WeaponType.Chaingun
            break
        }
        case '5': {
            nextWeapon = WeaponType.MissileLauncher
            break
        }
        case '6': {
            nextWeapon = WeaponType.PlasmaRifle
            break
        }
        case '7': {
            nextWeapon = WeaponType.Bfg
            break
        }
        default: {
            throw new Error(`Unexpected weapon key press ${key}`)
        }
    }
    if (playerState.weapon.info.type === nextWeapon) {
        return
    }
    if (playerState.nextWeapon === nextWeapon) {
        return
    }

    playerState.nextWeapon = nextWeapon
    setState(playerState.weapon, playerState.weapon.info.downstate)
}

PubSub.subscribe(ON_KEY_DOWN, weaponChange)
