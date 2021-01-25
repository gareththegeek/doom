import { Camera } from './Camera'
import { Geometry } from './Geometry'

export interface Scene {
    camera: Camera
    objects: Geometry[]
    texture: WebGLTexture
}
