const Buffer = require('buffer/').Buffer
import { vec2, vec3 } from 'gl-matrix'
import { BufferSet } from 'doom-video/dist/buffers/BufferSet'
import { Geometry } from 'doom-video/dist/scene/Geometry'
import {
    createTexture,
    createShaderProgram,
    createBufferSet,
    createCamera,
    initialiseScene,
    renderScene
} from 'doom-video'
import { readWad } from 'doom-wad'
import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { createAtlas } from 'doom-atlas'
import { createMapGeometry } from 'doom-map'

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

const fsSource = `
varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void) {
  gl_FragColor = texture2D(uSampler, vTextureCoord);
}
`

var Key = {
    _pressed: {} as { [keyCode: number]: boolean },

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    Q: 81,
    A: 65,

    isDown: function (keyCode: number) {
        return this._pressed[keyCode]
    },

    onKeydown: function (event: KeyboardEvent) {
        this._pressed[event.keyCode] = true
    },

    onKeyup: function (event: KeyboardEvent) {
        delete this._pressed[event.keyCode]
    }
}

window.addEventListener(
    'keyup',
    function (event) {
        Key.onKeyup(event)
    },
    false
)
window.addEventListener(
    'keydown',
    function (event) {
        Key.onKeydown(event)
    },
    false
)

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

const getWad = async (url: string): Promise<Wad> => {
    const response = await fetch(url)
    const blob = await response.blob()
    const array = await new Response(blob).arrayBuffer()
    const buffer = Buffer.from(array)
    return readWad(buffer)
}

const main = async () => {
    try {
        const canvas = document.querySelector('#canvas') as HTMLCanvasElement
        const gl = canvas.getContext('webgl')

        if (!gl) {
            throw new Error('Unable to acquire webgl context')
        }

        console.info('Loading')
        const wad = await getWad('doom.wad')
        console.info('Loaded doom.wad')
        const atlas = createAtlas(wad, 4096)
        console.info('Built texture atlas')
        const texture = createTexture(gl, 'cubetexture1.png')
        const map = createMapGeometry(gl, wad, atlas, 'e1m1')
        console.info('Built map geometry')
        const objects: Geometry[] = map.map((buffers) => ({
            position: [0.0, 0.0, 0.0],
            rotation: 0,
            buffers,
            texture
        }))
        console.info('Prepared scene')

        const buffers = createBuffers(gl)
        objects.push({
            position: [2.0, 0.0, 0.0],
            rotation: 0,
            buffers,
            texture
        })

        initialiseScene(gl)
        const program = createShaderProgram(gl, vsSource, fsSource)

        const camera = createCamera(gl, { fieldOfView: 45, zNear: 1, zFar: 100000 })
        camera.position = [0.0, 0.0, -100.0]

        const scene = {
            camera,
            objects
        }

        let then = 0
        let cubeRotation = 0.0
        const render = (now: number) => {
            now *= 0.001
            const deltaTime = now - then
            cubeRotation += deltaTime
            then = now

            if (Key.isDown(Key.UP)) camera.position[2] -= deltaTime*500
            if (Key.isDown(Key.LEFT)) camera.rotation += deltaTime
            if (Key.isDown(Key.DOWN)) camera.position[2] += deltaTime*500
            if (Key.isDown(Key.RIGHT)) camera.rotation -= deltaTime
            if (Key.isDown(Key.Q)) camera.position[1] += deltaTime*500
            if (Key.isDown(Key.A)) camera.position[1] -= deltaTime*500

            //camera.rotation = cubeRotation
            // cube0.rotation = cubeRotation
            // cube1.rotation = -cubeRotation

            renderScene(gl, program, scene)

            requestAnimationFrame(render)
        }

        requestAnimationFrame(render)
    } catch (e) {
        console.error(e.message)
    }
}

window.onload = main
