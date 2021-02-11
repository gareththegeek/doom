import { isStatefulObject } from '../global'
import { State, Stateful } from '../interfaces/State'
import { StateType } from '../interfaces/StateType'
import { StateLookup } from './StateLookup'

export const setState = (stateful: Stateful, stateType: StateType): void => {
    const state = StateLookup[stateType]
    if (isStatefulObject(stateful)) {
        stateful.geometry.position[0] -= stateful.state.spriteOffsetX ?? 0
    }
    stateful.state = state
    stateful.tics = state.tics
    if (isStatefulObject(stateful)) {
        stateful.geometry.position[0] += stateful.state.spriteOffsetX ?? 0
    }
}
