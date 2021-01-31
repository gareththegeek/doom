import { V } from '../system/global'
import { loadShader } from './loadShader'
import { ShaderProgram } from './ShaderProgram'

const vsSource = `
attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec4 aAtlasCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;
varying highp vec4 vAtlasCoord;
varying highp float depth;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vTextureCoord = aTextureCoord;
  vAtlasCoord = aAtlasCoord;
  depth = gl_Position.z;
}
`

const fsSource = `
varying highp vec2 vTextureCoord;
varying highp vec4 vAtlasCoord;
varying highp float depth;

uniform highp float uLightLevel;
uniform sampler2D uSamplerAtlas;
uniform sampler2D uSamplerPalette;
uniform sampler2D uSamplerColourMap;

const highp float MIN_LIGHT = 32.0 / 34.0;
const highp float ONE_LIGHT_LEVEL = 1.0 / 34.0;
const highp float HALF_LIGHT_LEVEL = ONE_LIGHT_LEVEL / 2.0;
const highp float MAX_DIMINISH = 12.0 * ONE_LIGHT_LEVEL;

void main(void) {
   highp vec2 sampleCoords = mix(vec2(vAtlasCoord.rg), vec2(vAtlasCoord.ba), fract(vTextureCoord));
   highp vec2 cmindex = texture2D(uSamplerAtlas, sampleCoords.yx).rg;
   if(cmindex.g < 0.5)
      discard;
   highp float diminish = clamp((floor(depth / 20.0) - 16.0) * ONE_LIGHT_LEVEL, -MAX_DIMINISH, MAX_DIMINISH);
   highp float final_light = clamp(uLightLevel + diminish, 0.0, MIN_LIGHT) + HALF_LIGHT_LEVEL;
   highp float index = texture2D(uSamplerColourMap, vec2(cmindex.r, final_light)).a;
   highp vec3 colour = texture2D(uSamplerPalette, vec2(index, 0.5)).rgb;
   gl_FragColor = vec4(colour, 1.0);
}
`

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
