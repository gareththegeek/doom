import { BufferSet } from './BufferSet'
import { SceneObject } from './SceneObject'

export interface Geometry extends SceneObject {
    buffers: BufferSet
    light: number
    flat: boolean
    visible: boolean
    frame?: number
    frameCount?: number
}
