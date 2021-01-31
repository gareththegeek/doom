import { V } from '../system/global'

export const loadShader = (type: number, source: string): WebGLShader => {
    const { gl } = V
    const shader = gl.createShader(type)

    if (!shader) {
        throw new Error(`Unable to create shader`)
    }

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
        gl.deleteShader(shader)
        throw new Error(message)
    }

    return shader
}
