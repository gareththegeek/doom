import { Camera } from './Camera'
import { GeometryBox } from './GeometryBox'

export interface Scene {
    camera: Camera
    ortho: Camera
    objects: GeometryBox[]
}
