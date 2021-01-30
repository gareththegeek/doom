import { vec2 } from 'gl-matrix'
import { Block } from '../interfaces/BlockMap'
import { Thing } from '../interfaces/Thing'

export interface ThingCollisionCheckResult {
    allow: boolean
    things: Thing[]
}

export const thingCollisionCheck = (blocks: Block[], thing: Thing, p0: vec2, p1: vec2): ThingCollisionCheckResult => ({
    //TODO thing collisions
    allow: true,
    things: []
})
