const Buffer = require('buffer/').Buffer
import { vec2 } from 'gl-matrix'
import { Geometry } from 'doom-video/dist/scene/Geometry'
import { createTexture, createShaderProgram, createCamera, initialiseScene, renderScene } from 'doom-video'
import { readWad } from 'doom-wad'
import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { createAtlas } from 'doom-atlas'
import { createMapGeometry } from 'doom-map'
import { Camera } from 'doom-video/dist/scene/Camera'
import { createIndexedTexture } from 'doom-video/dist/textures/createTexture'

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

uniform sampler2D uSampler0;
uniform sampler2D uSampler1;

void main(void) {
   highp vec2 index = texture2D(uSampler0, vTextureCoord).ra;
   highp vec3 colour = texture2D(uSampler1, vec2(index.r, 0)).rgb;
   gl_FragColor = vec4(colour, index.g);
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

const getWad = async (url: string): Promise<Wad> => {
    const response = await fetch(url)
    const blob = await response.blob()
    const array = await new Response(blob).arrayBuffer()
    const buffer = Buffer.from(array)
    return readWad(buffer)
}

const forward = (camera: Camera, speed: number): void => {
    const result: vec2 = [0, 0]
    vec2.rotate(result, [0, speed], [0, 0], -camera.rotation)

    camera.position[0] -= result[0]
    camera.position[2] -= result[1]
}

const main = async () => {
    try {
        const canvas = document.querySelector('#canvas') as HTMLCanvasElement
        const gl = canvas.getContext('webgl2')

        if (!gl) {
            throw new Error('Unable to acquire webgl context')
        }

        console.info('Loading')
        const wad = await getWad('doom.wad')
        console.info('Loaded doom.wad')
        const atlas = createAtlas(wad, 4096)
        console.info('Built texture atlas')
        const map = createMapGeometry(gl, wad, atlas, 'e1m1')
        //const texture = createIndexedTexture(gl, wad.flats['floor5_1'].pixels)
        const texture = createIndexedTexture(gl, wad.flats['flat5_6'].pixels)
        console.info('Built map geometry')
        const objects: Geometry[] = map.map((buffers) => ({
            position: [0.0, 0.0, 0.0],
            rotation: 0,
            buffers,
            texture
        }))
        console.info('Prepared scene')

        //TODO get indexed textures working by using a single flat for everything
        // Flats are same format as the texture atlas but
        // don't need the complex texture coordinate calculations

        initialiseScene(gl)
        const program = createShaderProgram(gl, vsSource, fsSource)

        const palette = createTexture(gl, wad.playpal.palettes[0].colours)
        gl.activeTexture(gl.TEXTURE1)
        gl.bindTexture(gl.TEXTURE_2D, palette)
        
        const camera = createCamera(gl, { fieldOfView: 45, zNear: 1, zFar: 100000 })
        camera.position = [0.0, 0.0, 0.0]
        camera.rotation = Math.PI

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

            if (Key.isDown(Key.UP)) forward(camera, deltaTime * 500)
            if (Key.isDown(Key.LEFT)) camera.rotation += deltaTime * 3
            if (Key.isDown(Key.DOWN)) forward(camera, -deltaTime * 500)
            if (Key.isDown(Key.RIGHT)) camera.rotation -= deltaTime * 3
            if (Key.isDown(Key.Q)) camera.position[1] += deltaTime * 500
            if (Key.isDown(Key.A)) camera.position[1] -= deltaTime * 500

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
