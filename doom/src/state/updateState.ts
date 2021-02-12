import { Stateful } from '../interfaces/State'
import { StateType } from '../interfaces/StateType'
import { removeStateful } from './removeStateful'
import { setState } from './setState'

export const updateState = (stateful: Stateful) => {
    if (stateful.singleFrame) {
        removeStateful(stateful)
        return
    }

    stateful.tics -= 1
    if (stateful.tics > 0) {
        return
    }
    if (stateful.state.action !== undefined) {
        stateful.state.action(stateful)
    }
    if (stateful.state.nextState === StateType.S_NULL) {
        return
    }
    setState(stateful, stateful.state.nextState)
    stateful.tics = stateful.state.tics
}
