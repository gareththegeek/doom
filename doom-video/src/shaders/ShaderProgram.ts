export interface ShaderProgram {
    name: string
    program: WebGLProgram
    attribLocations: { [name: string]: number }
    uniformLocations: { [name: string]: WebGLUniformLocation }
}
