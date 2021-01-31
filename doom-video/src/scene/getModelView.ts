import { mat4, vec3 } from 'gl-matrix'
import { Camera } from '..'
import { SceneObject } from '../interfaces/SceneObject'

const isCamera = (object: SceneObject): object is Camera => 'projection' in object

export const getModelView = (object: SceneObject): mat4 => {
    const modelView = mat4.create()
    if (isCamera(object)) {
        let position = [...object.position] as vec3
        let rotation = object.rotation
        if (object.target !== undefined) {
            vec3.add(position, object.position, object.target.position)
            rotation = object.target.rotation
        }
        mat4.rotateY(modelView, modelView, -rotation)
        mat4.translate(modelView, modelView, vec3.negate(vec3.create(), position))
    } else {
        mat4.translate(modelView, modelView, object.position)
        mat4.rotateY(modelView, modelView, object.rotation)
    }
    return modelView
}
