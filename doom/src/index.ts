import { vec2 } from 'gl-matrix'
import { Geometry } from 'doom-video/dist/scene/Geometry'
import {
    createIndexedTexture,
    createPalette,
    createColourMap,
    createShaderProgram,
    createCamera,
    initialiseScene,
    renderScene,
    createSprite
} from 'doom-video'
import { fetchWad } from 'doom-wad'
import { createAtlas } from 'doom-atlas'
import { createMapGeometry } from 'doom-map'
import { Camera } from 'doom-video/dist/scene/Camera'

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
const highp float MAX_DIMINISH = 12.0 * ONE_LIGHT_LEVEL;

void main(void) {
   highp vec2 sampleCoords = mix(vec2(vAtlasCoord.rg), vec2(vAtlasCoord.ba), fract(vTextureCoord));
   highp vec2 cmindex = texture2D(uSamplerAtlas, sampleCoords.yx).rg;
   if(cmindex.g < 0.5)
      discard;
   highp float diminish = clamp((depth / 20.0 - 16.0) * ONE_LIGHT_LEVEL, -MAX_DIMINISH, MAX_DIMINISH);
   highp float final_light = clamp(uLightLevel + diminish, 0.0, MIN_LIGHT);
   highp float index = texture2D(uSamplerColourMap, vec2(cmindex.r, final_light)).a;
   highp vec3 colour = texture2D(uSamplerPalette, vec2(index, 0.5)).rgb;
   gl_FragColor = vec4(colour, 1.0);
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

        console.info('Loading...')
        const wad = await fetchWad('doom.wad')
        console.info('Loaded doom.wad')
        const atlas = createAtlas(wad, 4096)
        const texture = createIndexedTexture(gl, atlas.image, 4096)
        const palette = createPalette(gl, wad.playpal.palettes[0].colours)
        const colourmaps = createColourMap(gl, wad.colormap.maps)
        console.info('Built textures')
        const map = createMapGeometry(gl, wad, atlas, 'e1m1')
        console.info('Built map geometry')
        const objects: Geometry[] = map.map((buffers, index) => ({
            position: [0.0, 0.0, 0.0],
            rotation: 0,
            buffers,
            flat: false,
            light: wad.maps['e1m1'].sectors[index].lightLevel
        }))
        console.info('Prepared scene')

        const imp = createSprite(gl, atlas, 'trooa1')
        imp.position = [1760, 0, 2206]
        objects.push(imp)

        initialiseScene(gl)
        const program = createShaderProgram(gl, vsSource, fsSource)

        const camera = createCamera(gl, { fieldOfView: 45, zNear: 1, zFar: 100000 })
        camera.position = [2103.112593621454, 41.670000000014085, 2354.890666609926]
        camera.rotation = 7.491532653589783

        const scene = {
            camera,
            objects,
            texture,
            palette,
            colourmaps
        }

        // let last = 0
        let then = 0
        const render = (now: number) => {
            now *= 0.001
            const deltaTime = now - then
            then = now

            if (Key.isDown(Key.UP)) forward(camera, deltaTime * 500)
            if (Key.isDown(Key.LEFT)) camera.rotation += deltaTime * 3
            if (Key.isDown(Key.DOWN)) forward(camera, -deltaTime * 500)
            if (Key.isDown(Key.RIGHT)) camera.rotation -= deltaTime * 3
            if (Key.isDown(Key.Q)) camera.position[1] += deltaTime * 500
            if (Key.isDown(Key.A)) camera.position[1] -= deltaTime * 500

            renderScene(gl, program, scene)

            // if (now - last > 1) {
            //     console.log(`${camera.position} ${camera.rotation}`)
            //     last = now
            // }

            requestAnimationFrame(render)
        }

        requestAnimationFrame(render)
    } catch (e) {
        console.error(e.message)
    }
}

window.onload = main
