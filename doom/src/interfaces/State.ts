import { Thing } from 'doom-map'
import { Geometry } from 'doom-video'
import { Block } from './BlockMap'
import { ObjectInfo } from './ObjectInfo'
import { Sector } from './Sector'
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
    sector: Sector
    block: Block | undefined
}

export interface StatefulObject extends Stateful {
    geometry: Geometry
}

export interface StatefulThing extends Stateful {
    thing: Thing
    info: ObjectInfo
}

export type StatefulObjectThing = StatefulThing & StatefulObject
