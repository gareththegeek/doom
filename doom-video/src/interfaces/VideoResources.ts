import { ShaderProgram } from "../shaders/ShaderProgram";

export interface VideoResources {
    texture: WebGLTexture
    palette: WebGLTexture
    colourmaps: WebGLTexture
    program: ShaderProgram
}
