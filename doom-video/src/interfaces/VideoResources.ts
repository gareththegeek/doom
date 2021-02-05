import { ShaderProgram } from '../shaders/ShaderProgram'

export interface VideoResources {
    texture: WebGLTexture
    palette: WebGLTexture
    colourmaps: WebGLTexture
    programs: { [name: string]: ShaderProgram }
}
