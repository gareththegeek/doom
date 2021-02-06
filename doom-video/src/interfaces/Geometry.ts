import { BufferSet } from './BufferSet'
import { SceneObject } from './SceneObject'

export interface Geometry extends SceneObject {
    spriteName?: string
    buffers: BufferSet
    light: number
    flat: boolean
    screenspace: boolean
    visible: boolean
    startIndex?: number
    indexCount?: number
}
