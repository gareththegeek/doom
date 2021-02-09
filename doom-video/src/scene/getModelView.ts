import { mat4, vec3 } from 'gl-matrix'
import { Camera } from '..'
import { SceneObject } from '../interfaces/SceneObject'

const isCamera = (object: SceneObject): object is Camera => 'projection' in object

let temp = vec3.create()
let position = vec3.create()

export const getModelView = (modelViewOut: mat4, object: SceneObject): void => {
    mat4.identity(modelViewOut)
    if (isCamera(object)) {
        position[0] = object.position[0]
        position[1] = object.position[1]
        position[2] = object.position[2]
        let rotation = object.rotation
        if (object.target !== undefined) {
            vec3.add(position, object.position, object.target.position)
            rotation = object.target.rotation
        }
        mat4.rotateY(modelViewOut, modelViewOut, -rotation)
        mat4.translate(modelViewOut, modelViewOut, vec3.negate(temp, position))
    } else {
        mat4.translate(modelViewOut, modelViewOut, object.position)
        mat4.rotateY(modelViewOut, modelViewOut, object.rotation)
    }
}
