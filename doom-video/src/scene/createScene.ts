import { vec3 } from 'gl-matrix'
import { Scene } from '..'
import { GeometryBox } from '../interfaces/GeometryBox'
import { SceneObject } from '../interfaces/SceneObject'
import { V } from '../system/global'
import { createOrthographicCamera, createPerspectiveCamera } from './createCamera'

export const createScene = (objects: GeometryBox[], cameraTarget: SceneObject, cameraOffset: vec3): Scene => {
    V.scene = {
        camera: createPerspectiveCamera({ fieldOfView: 45, zNear: 1, zFar: 100000 }, cameraTarget, cameraOffset),
        ortho: createOrthographicCamera(),
        objects
    }
    return V.scene
}
