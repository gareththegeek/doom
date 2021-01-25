import { loadShader } from './loadShader'
import { ShaderProgram } from './ShaderProgram'

const getUniformLocation = (gl: WebGL2RenderingContext, program: WebGLProgram, name: string): WebGLUniformLocation => {
    const result = gl.getUniformLocation(program, name)
    if (!result) {
        throw new Error(`Unable to get uniform location '${name}' for program`)
    }
    return result
}

export const createShaderProgram = (gl: WebGL2RenderingContext, vsSource: string, fsSource: string): ShaderProgram => {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

    const program = gl.createProgram()
    if (!program) {
        throw new Error('Unable to create shader program')
    }
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(program)}`)
    }

    const result = {
        program,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
            textureCoord: gl.getAttribLocation(program, 'aTextureCoord')
        },
        uniformLocations: {
            projectionMatrix: getUniformLocation(gl, program, 'uProjectionMatrix'),
            modelViewMatrix: getUniformLocation(gl, program, 'uModelViewMatrix'),
            uSampler0: getUniformLocation(gl, program, 'uSampler0'),
            uSampler1: getUniformLocation(gl, program, 'uSampler1')
        }
    }

    gl.useProgram(program)
    gl.uniform1i(result.uniformLocations.uSampler0, 0)
    gl.uniform1i(result.uniformLocations.uSampler1, 1)

    return result
}
