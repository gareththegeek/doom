import { Thing } from 'doom-map'
import { StateType } from './StateType'

export type ActionHandler = (stateful: Stateful) => void

export interface State {
    spriteName: string
    frame: number
    tics: number
    action: ActionHandler | undefined
    nextState: StateType
}

export interface Stateful {
    state: State
}

export interface StatefulThing extends Stateful {
    thing: Thing
}
