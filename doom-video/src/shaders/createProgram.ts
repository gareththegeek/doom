import { loadShader } from './loadShader'
import { ShaderProgram } from './ShaderProgram'

const getUniformLocation = (gl: WebGLRenderingContext, program: WebGLProgram, name: string): WebGLUniformLocation => {
    const result = gl.getUniformLocation(program, name)
    if (!result) {
        throw new Error(`Unable to get uniform location '${name}' for program`)
    }
    return result
}

export const createShaderProgram = (gl: WebGLRenderingContext, vsSource: string, fsSource: string): ShaderProgram => {
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
            uSampler: getUniformLocation(gl, program, 'uSampler')
        }
    }

    gl.useProgram(program)
    gl.uniform1i(result.uniformLocations.uSampler, 0)

    return result
}
