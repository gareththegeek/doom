export const loadShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader => {
    const shader = gl.createShader(type)

    if (!shader) {
        throw new Error(`Unable to create shader`)
    }

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader)
        throw new Error(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`)
    }

    return shader
}
