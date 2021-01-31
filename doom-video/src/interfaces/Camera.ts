import { mat4 } from 'gl-matrix'
import { SceneObject } from './SceneObject'

export interface Camera extends SceneObject {
    projection: mat4
    target: SceneObject | undefined
}
