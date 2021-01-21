export interface ShaderProgram {
    program: WebGLProgram
    attribLocations: { [name: string]: number }
    uniformLocations: { [name: string]: WebGLUniformLocation }
}
