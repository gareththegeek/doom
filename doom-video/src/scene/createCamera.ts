import { mat4, vec3 } from 'gl-matrix'
import { Camera, SceneObject } from '..'
import { PerspectiveParams } from '../interfaces/PerspectiveParams'
import { V } from '../system/global'

export const createCamera = (
    { fieldOfView, zNear, zFar }: PerspectiveParams,
    target: SceneObject,
    offset: vec3
): Camera => {
    const { gl } = V
    const { clientWidth, clientHeight } = gl.canvas as HTMLCanvasElement
    const vFieldOfViewRadians = fieldOfView * (Math.PI / 180)
    const hFieldOfViewRadians = vFieldOfViewRadians * (clientWidth / clientHeight)
    const aspect = clientWidth / clientHeight
    const projection = mat4.create()
    mat4.perspective(projection, vFieldOfViewRadians, aspect, zNear, zFar)
    
    return {
        projection,
        fov: [hFieldOfViewRadians, vFieldOfViewRadians],
        resolution: [clientWidth, clientHeight],
        position: offset,
        rotation: 0,
        target
    }
}
