import { V } from '../system/global'
import { loadShader } from './loadShader'
import { ShaderProgram } from './ShaderProgram'
import vsWorldSpaceSource from './glsl/vsWorld'
import fsWorldSpaceSource from './glsl/fsWorld'

export const WORLD_SPACE_PROGRAM = 'WORLD_SPACE_PROGRAM'

const sources = [{ name: WORLD_SPACE_PROGRAM, vs: vsWorldSpaceSource, fs: fsWorldSpaceSource }]

const getUniformLocation = (program: WebGLProgram, name: string): WebGLUniformLocation => {
    const { gl } = V
    const result = gl.getUniformLocation(program, name)
    if (!result) {
        throw new Error(`Unable to get uniform location '${name}' for program`)
    }
    return result
}

export const createShaderPrograms = (): ShaderProgram[] =>
    sources.map(({ name, vs, fs }) => {
        const { gl } = V
        const vertexShader = loadShader(gl.VERTEX_SHADER, vs)
        const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fs)

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
            name,
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
    })
