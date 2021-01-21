import { vec2, vec3 } from 'gl-matrix'
import { BufferSet } from './buffers/BufferSet'
import { createBufferSet } from './buffers'
import { createCamera, renderScene } from './scene'
import { createShaderProgram } from './shaders'
import { createTexture } from './textures'
import { Geometry } from './scene/Geometry'

let cubeRotation = 0.0

const vsSource = `
attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vTextureCoord = aTextureCoord;
}
`

// const vsSource = `
// attribute vec4 aVertexPosition;
// attribute vec4 aVertexColor;

// uniform mat4 uModelViewMatrix;
// uniform mat4 uProjectionMatrix;

// varying lowp vec4 vColor;

// void main(void) {
//   gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
//   vColor = aVertexColor;
// }
// `

// const fsSource = `
// varying lowp vec4 vColor;

// void main(void) {
//   gl_FragColor = vColor;
// }
// `

const fsSource = `
varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void) {
  gl_FragColor = texture2D(uSampler, vTextureCoord);
}
`

const createBuffers = (gl: WebGLRenderingContext): BufferSet => {
    // Now create an array of positions for the cube.
    const positions = [
        // Front face
        vec3.fromValues(-1.0, -1.0, 1.0),
        vec3.fromValues(1.0, -1.0, 1.0),
        vec3.fromValues(1.0, 1.0, 1.0),
        vec3.fromValues(-1.0, 1.0, 1.0),

        // Back face
        vec3.fromValues(-1.0, -1.0, -1.0),
        vec3.fromValues(-1.0, 1.0, -1.0),
        vec3.fromValues(1.0, 1.0, -1.0),
        vec3.fromValues(1.0, -1.0, -1.0),

        // Top face
        vec3.fromValues(-1.0, 1.0, -1.0),
        vec3.fromValues(-1.0, 1.0, 1.0),
        vec3.fromValues(1.0, 1.0, 1.0),
        vec3.fromValues(1.0, 1.0, -1.0),

        // Bottom face
        vec3.fromValues(-1.0, -1.0, -1.0),
        vec3.fromValues(1.0, -1.0, -1.0),
        vec3.fromValues(1.0, -1.0, 1.0),
        vec3.fromValues(-1.0, -1.0, 1.0),

        // Right face
        vec3.fromValues(1.0, -1.0, -1.0),
        vec3.fromValues(1.0, 1.0, -1.0),
        vec3.fromValues(1.0, 1.0, 1.0),
        vec3.fromValues(1.0, -1.0, 1.0),

        // Left face
        vec3.fromValues(-1.0, -1.0, -1.0),
        vec3.fromValues(-1.0, -1.0, 1.0),
        vec3.fromValues(-1.0, 1.0, 1.0),
        vec3.fromValues(-1.0, 1.0, -1.0)
    ]

    const indices = [
        0,
        1,
        2,
        0,
        2,
        3, // front
        4,
        5,
        6,
        4,
        6,
        7, // back
        8,
        9,
        10,
        8,
        10,
        11, // top
        12,
        13,
        14,
        12,
        14,
        15, // bottom
        16,
        17,
        18,
        16,
        18,
        19, // right
        20,
        21,
        22,
        20,
        22,
        23 // left
    ]

    const textures = [
        // Front
        vec2.fromValues(0.0, 0.0),
        vec2.fromValues(1.0, 0.0),
        vec2.fromValues(1.0, 1.0),
        vec2.fromValues(0.0, 1.0),
        // Back
        vec2.fromValues(0.0, 0.0),
        vec2.fromValues(1.0, 0.0),
        vec2.fromValues(1.0, 1.0),
        vec2.fromValues(0.0, 1.0),
        // Top
        vec2.fromValues(0.0, 0.0),
        vec2.fromValues(1.0, 0.0),
        vec2.fromValues(1.0, 1.0),
        vec2.fromValues(0.0, 1.0),
        // Bottom
        vec2.fromValues(0.0, 0.0),
        vec2.fromValues(1.0, 0.0),
        vec2.fromValues(1.0, 1.0),
        vec2.fromValues(0.0, 1.0),
        // Right
        vec2.fromValues(0.0, 0.0),
        vec2.fromValues(1.0, 0.0),
        vec2.fromValues(1.0, 1.0),
        vec2.fromValues(0.0, 1.0),
        // Left
        vec2.fromValues(0.0, 0.0),
        vec2.fromValues(1.0, 0.0),
        vec2.fromValues(1.0, 1.0),
        vec2.fromValues(0.0, 1.0)
    ]

    return createBufferSet(gl, { positions, indices, textures })
}

const main = async () => {
    try {
        const canvas = document.querySelector('#canvas') as HTMLCanvasElement
        const gl = canvas.getContext('webgl')

        if (!gl) {
            throw new Error('Unable to acquire webgl context')
        }

        const program = createShaderProgram(gl, vsSource, fsSource)

        gl.clearColor(0.0, 0.0, 0.0, 1.0) // Clear to black, fully opaque
        gl.clearDepth(1.0) // Clear everything
        gl.enable(gl.DEPTH_TEST) // Enable depth testing
        gl.depthFunc(gl.LEQUAL) // Near things obscure far things

        gl.useProgram(program.program)
        gl.uniform1i(program.uniformLocations.uSampler, 0)

        const camera = createCamera(gl, { fieldOfView: 45, zNear: 0.1, zFar: 100 })
        camera.position = [0.0, 0.0, 6.0]

        const buffers = createBuffers(gl)
        const cube0: Geometry = {
            position: [2.0, 0.0, 0.0],
            rotation: 0,
            buffers,
            texture: createTexture(gl, 'cubetexture.png')
        }
        const cube1: Geometry = {
            position: [-2.0, 0.0, 0.0],
            rotation: 0,
            buffers,
            texture: createTexture(gl, 'cubetexture.png')
        }

        const scene = {
            camera,
            objects: [cube0, cube1]
        }

        let then = 0
        const render = (now: number) => {
            now *= 0.001
            const deltaTime = now - then
            cubeRotation += deltaTime
            then = now

            cube0.rotation = cubeRotation
            cube1.rotation = -cubeRotation

            renderScene(gl, program, scene)

            requestAnimationFrame(render)
        }

        requestAnimationFrame(render)
    } catch (e) {
        console.error(e.message)
    }
}

window.onload = main
