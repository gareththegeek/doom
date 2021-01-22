import { mat4, vec3 } from 'gl-matrix'
import { Camera } from './Camera'
import { SceneObject } from './SceneObject'

const isCamera = (object: SceneObject): object is Camera => 'projection' in object

export const getModelView = (object: SceneObject): mat4 => {
    const modelView = mat4.create()
    if (isCamera(object)) {
        mat4.rotateY(modelView, modelView, -object.rotation)
        mat4.translate(modelView, modelView, vec3.negate(vec3.create(), object.position))
    } else {
        mat4.translate(modelView, modelView, object.position)
        mat4.rotateY(modelView, modelView, object.rotation)
    }
    return modelView
}
