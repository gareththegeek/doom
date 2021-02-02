import { V } from '../system/global'
import { loadShader } from './loadShader'
import { ShaderProgram } from './ShaderProgram'

const vsSource = require('./vs.glsl')
const fsSource = require('./fs.glsl')

const getUniformLocation = (program: WebGLProgram, name: string): WebGLUniformLocation => {
    const { gl } = V
    const result = gl.getUniformLocation(program, name)
    if (!result) {
        throw new Error(`Unable to get uniform location '${name}' for program`)
    }
    return result
}

export const createShaderProgram = (): ShaderProgram => {
    const { gl } = V
    const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource)
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource)

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
            textureCoord: gl.getAttribLocation(program, 'aTextureCoord'),
            atlasCoord: gl.getAttribLocation(program, 'aAtlasCoord')
        },
        uniformLocations: {
            projectionMatrix: getUniformLocation(program, 'uProjectionMatrix'),
            modelViewMatrix: getUniformLocation(program, 'uModelViewMatrix'),
            lightLevel: getUniformLocation(program, 'uLightLevel'),
            uSamplerAtlas: getUniformLocation(program, 'uSamplerAtlas'),
            uSamplerPalette: getUniformLocation(program, 'uSamplerPalette'),
            uSamplerColourMap: getUniformLocation(program, 'uSamplerColourMap')
        }
    }

    gl.useProgram(program)
    gl.uniform1i(result.uniformLocations.uSamplerAtlas, 0)
    gl.uniform1i(result.uniformLocations.uSamplerPalette, 1)
    gl.uniform1i(result.uniformLocations.uSamplerColourMap, 2)

    return result
}
