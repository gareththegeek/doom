import { mat4 } from 'gl-matrix'
import { Camera } from './Camera'
import { PerspectiveParams } from './PerspectiveParams'

export const createCamera = (gl: WebGL2RenderingContext, { fieldOfView, zNear, zFar }: PerspectiveParams): Camera => {
    const fieldOfViewRadians = (fieldOfView * Math.PI) / 180
    const { clientWidth, clientHeight } = gl.canvas as HTMLCanvasElement
    const aspect = clientWidth / clientHeight
    const projection = mat4.create()
    mat4.perspective(projection, fieldOfViewRadians, aspect, zNear, zFar)

    return {
        projection,
        position: [0, 0, 0],
        rotation: 0,
        target: undefined
    }
}
