import { createSpriteGeometry } from 'doom-sprite'
import { HomogenousHeap } from 'low-mem'
import { Sector } from '../interfaces/Sector'
import { Stateful, StatefulObject } from '../interfaces/State'
import { StateType } from '../interfaces/StateType'
import { setState } from './setState'
import { StateLookup } from './StateLookup'

const createNewStateful = (): Stateful => {
    return {
        tics: 0,
        state: StateLookup[StateType.S_NULL],
        sector: (undefined as unknown) as Sector,
        block: undefined
    }
}

const heap = new HomogenousHeap<Stateful>(createNewStateful)

export const allocateStateful = (type: StateType): Stateful => {
    const result = heap.allocate()
    setState(result, type)
    result.tics = result.state.tics
    return result
}

export const allocateSprite = (type: StateType): StatefulObject => {
    const result = allocateStateful(type) as StatefulObject
    result.geometry = createSpriteGeometry(result.state.spriteName)
    return result
}

export const freeStateful = (stateful: Stateful): void => heap.free(stateful)

export const clearHeap = () => heap.clear()
