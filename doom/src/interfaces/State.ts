import { Thing } from 'doom-map'
import { Geometry } from 'doom-video'
import { vec3 } from 'gl-matrix'
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
    spriteOffsetX?: number
}

export interface Stateful {
    tics: number
    state: State
    sector: Sector
    block: Block | undefined
    geometry: Geometry
    thing?: Thing
    singleFrame: boolean
}

export interface Physics extends Stateful {
    info: ObjectInfo
    velocity: vec3
    acceleration: vec3
}

export const isPhysics = (stateful: Stateful): stateful is Physics => 'velocity' in stateful
