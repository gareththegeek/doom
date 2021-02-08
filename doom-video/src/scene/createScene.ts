import { vec3 } from 'gl-matrix'
import { Scene } from '..'
import { LinkedList } from 'low-mem'
import { GeometryBox } from '../interfaces/GeometryBox'
import { SceneObject } from '../interfaces/SceneObject'
import { V } from '../system/global'
import { createOrthographicCamera, createPerspectiveCamera } from './createCamera'

export const createScene = (
    objects: LinkedList<GeometryBox>,
    rooms: GeometryBox[],
    cameraTarget: SceneObject,
    cameraOffset: vec3
): Scene => {
    V.scene = {
        camera: createPerspectiveCamera({ fieldOfView: 45, zNear: 1, zFar: 100000 }, cameraTarget, cameraOffset),
        ortho: createOrthographicCamera(),
        objects,
        rooms
    }
    return V.scene
}
