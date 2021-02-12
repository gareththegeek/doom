import { Stateful } from '../interfaces/State'
import { StateType } from '../interfaces/StateType'
import { StateLookup } from './StateLookup'

export const setState = (stateful: Stateful, stateType: StateType): void => {
    const state = StateLookup[stateType]
    if (stateful.geometry !== undefined) {
        stateful.geometry.position[0] -= stateful.state.spriteOffsetX ?? 0
    }
    stateful.state = state
    stateful.tics = state.tics
    if (stateful.geometry !== undefined) {
        stateful.geometry.position[0] += stateful.state.spriteOffsetX ?? 0
    }
}
