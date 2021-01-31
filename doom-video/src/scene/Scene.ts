import { Camera } from './Camera'
import { GeometryBox } from './GeometryBox'

export interface Scene {
    camera: Camera
    objects: GeometryBox[]
    texture: WebGLTexture
    palette: WebGLTexture
    colourmaps: WebGLTexture
}
