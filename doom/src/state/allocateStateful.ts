import { createSpriteGeometry } from 'doom-sprite'
import { Geometry } from 'doom-video'
import { vec3 } from 'gl-matrix'
import { HomogenousHeap } from 'low-mem'
import { ObjectInfo } from '../interfaces/ObjectInfo'
import { Sector } from '../interfaces/Sector'
import { isPhysics, Physics, Stateful } from '../interfaces/State'
import { StateType } from '../interfaces/StateType'
import { isWeapon, Weapon, WeaponInfo } from '../interfaces/Weapon'
import { setState } from './setState'
import { StateLookup } from './StateLookup'

const createNewStateful = (): Stateful => ({
    tics: 0,
    state: StateLookup[StateType.S_NULL],
    sector: (undefined as unknown) as Sector,
    block: undefined,
    geometry: (undefined as unknown) as Geometry
})

const createNewPhysics = (): Physics => ({
    tics: 0,
    state: StateLookup[StateType.S_NULL],
    sector: (undefined as unknown) as Sector,
    block: undefined,
    info: (undefined as unknown) as ObjectInfo,
    velocity: vec3.create(),
    acceleration: vec3.create(),
    geometry: (undefined as unknown) as Geometry
})

const createNewWeapon = (): Weapon => ({
    ammo: 0,
    tics: 0,
    state: StateLookup[StateType.S_NULL],
    sector: (undefined as unknown) as Sector,
    block: undefined,
    info: (undefined as unknown) as WeaponInfo,
    geometry: (undefined as unknown) as Geometry
})

const statefulHeap = new HomogenousHeap<Stateful>(createNewStateful)
const physicsHeap = new HomogenousHeap<Physics>(createNewPhysics)
const weaponHeap = new HomogenousHeap<Weapon>(createNewWeapon)

export const allocateStateful = (type: StateType): Stateful => {
    const result = statefulHeap.allocate()
    setState(result, type)
    result.tics = result.state.tics
    result.geometry = createSpriteGeometry(result.state.spriteName)
    return result
}

export const allocatePhysics = (type: StateType): Physics => {
    const result = physicsHeap.allocate()
    setState(result, type)
    result.tics = result.state.tics
    result.geometry = createSpriteGeometry(result.state.spriteName)
    return result
}

export const allocateWeapon = (type: StateType): Weapon => {
    const result = weaponHeap.allocate()
    setState(result, type)
    result.tics = result.state.tics
    result.geometry = createSpriteGeometry(result.state.spriteName)
    return result
}

export const freeStateful = (stateful: Stateful): void => {
    if (isPhysics(stateful)) {
        physicsHeap.free(stateful)
    } else if (isWeapon(stateful)) {
        weaponHeap.free(stateful)
    } else {
        statefulHeap.free(stateful)
    }
}

export const clearHeap = () => {
    statefulHeap.clear()
    weaponHeap.clear()
    physicsHeap.clear()
}
