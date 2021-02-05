import { mat4, vec2 } from 'gl-matrix'
import { SceneObject } from './SceneObject'

export interface Camera extends SceneObject {
    projection: mat4
    fov: vec2
    resolution: vec2
    target: SceneObject | undefined
}
