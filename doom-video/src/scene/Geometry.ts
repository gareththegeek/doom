import { BufferSet } from '../buffers/BufferSet'
import { SceneObject } from './SceneObject'

export interface Geometry extends SceneObject {
    buffers: BufferSet
    light: number
    flat: boolean
}
