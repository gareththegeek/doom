import { vec3 } from 'gl-matrix'
import { GeometryBox } from '../interfaces/GeometryBox'
import { SceneObject } from '../interfaces/SceneObject'
import { V } from '../system/global'
import { createCamera } from './createCamera'

export const createScene = (objects: GeometryBox[], cameraTarget: SceneObject, cameraOffset: vec3): void => {
    V.scene = {
        camera: createCamera({ fieldOfView: 45, zNear: 1, zFar: 100000 }, cameraTarget, cameraOffset),
        objects
    }
}
