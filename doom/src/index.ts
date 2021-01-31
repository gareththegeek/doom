import { vec2 } from 'gl-matrix'
import { Geometry } from 'doom-video/dist/scene/Geometry'
import {
    createIndexedTexture,
    createPalette,
    createColourMap,
    createShaderProgram,
    createCamera,
    initialiseScene,
    renderScene
} from 'doom-video'
import { fetchWad } from 'doom-wad'
import { createAtlas } from 'doom-atlas'
import { BlockMap, createMap, Sector, Thing, Map, Line, rebuildSectorGeometry } from 'doom-map'
import { collisionCheck } from './collisions/collisionCheck'
import { Scene } from 'doom-video/dist/scene/Scene'
import { use } from './collisions/use'
import { SkillType } from 'doom-map/dist/interfaces/MapFlags'
import { ActivateLookup } from './game/activate'
import { getAdjacenctSectors } from './getAdjacentSectors'

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

let noclip = false
let loadMap: (mapName: string) => any
let player: Thing | undefined
let scene: Scene
let map: Map

var Key = {
    _pressed: {} as { [keyCode: number]: boolean },

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    Q: 81,
    A: 65,
    SPACE: 32,
    code: 'AAAAAAAA',

    isDown: function (keyCode: number) {
        return this._pressed[keyCode]
    },

    onKeydown: function (event: KeyboardEvent) {
        this._pressed[event.keyCode] = true
        if (event.keyCode === Key.SPACE) {
            if (player !== undefined) {
                use(map.blockmap, map.sectors, player)
            }
        }
        const letter = String.fromCharCode(event.keyCode)
        if (/[A-Z0-9]/.test(letter)) {
            this.code = this.code.substr(1) + letter
            if (this.code.endsWith('IDCLIP')) {
                noclip = !noclip
                console.log(`noclip ${noclip}`)
            }
            if (/IDCLEV[1-4][1-9]/.test(this.code)) {
                const e = this.code[this.code.length - 2]
                const m = this.code[this.code.length - 1]
                const mapName = `e${e}m${m}`
                loadMap(mapName)
            }
        }
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

const forward = (thing: Thing | undefined, speed: number): void => {
    if (thing == undefined) {
        return
    }

    const geometry = thing.geometry!
    const result: vec2 = [0, 0]
    vec2.rotate(result, [0, speed], [0, 0], -geometry.rotation)

    const t0 = [geometry.position[0], geometry.position[2]] as vec2
    let t1 = vec2.create()
    vec2.subtract(t1, t0, result)

    const postCollisionPosition = collisionCheck(map.blockmap, thing, t0, t1)
    if (!noclip) {
        t1 = postCollisionPosition
    }

    geometry.position[0] = t1[0]
    geometry.position[2] = t1[1]
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

        loadMap = (mapName: string) => {
            console.log(`Loading map ${mapName}`)
            const wadMap = wad.maps[mapName]
            map = createMap(gl, atlas, wadMap, { multiplayer: false, skill: SkillType.skill45 })
            console.info('Map loaded')
            console.info('Configuring player')
            player = map.things.find((thing) => thing.type === 1)
            if (player === undefined || player.geometry === undefined) {
                throw new Error('Unable to find player start in level D:')
            }
            player.geometry.visible = false
            const camera = createCamera(gl, { fieldOfView: 45, zNear: 1, zFar: 100000 })
            camera.target = player.geometry
            camera.position = [0.0, 48.0, 0.0]
            const objects = [...map.sectors.map((sector) => sector), ...map.things.map((thing) => thing)]
            scene = {
                camera,
                objects,
                texture,
                palette,
                colourmaps
            }
            console.info('Prepared scene')

            const DOOR_LIP = 4
            ActivateLookup[1] = (line: Line): void => {
                const sector = line.back?.sector
                if (sector === undefined) {
                    console.warn(`Unable to find door sector`)
                    return
                }

                const adjacent = getAdjacenctSectors(sector)
                const target = adjacent.reduce((a, c) => Math.min(a, c.ceilingHeight), 0x7fff) - DOOR_LIP
                const id = setInterval(() => {
                    sector.ceilingHeight += 2
                    if (sector.ceilingHeight >= target) {
                        sector.ceilingHeight = target
                        clearInterval(id)
                    }
                    rebuildSectorGeometry(gl, atlas, map, sector)
                    adjacent.forEach((sector) => rebuildSectorGeometry(gl, atlas, map, sector))
                }, 1000 / 35)
            }
        }

        loadMap('e1m1')

        initialiseScene(gl)
        const program = createShaderProgram(gl, vsSource, fsSource)

        // let last = 0
        let then = 0
        let lastAnim = 0
        const render = (now: number) => {
            now *= 0.001
            const deltaTime = now - then
            then = now

            const geometry = player!.geometry!

            if (now - lastAnim > 0.2) {
                map.things.forEach((thing) => {
                    if (thing.geometry !== undefined) {
                        thing.geometry.frame = (thing.geometry.frame! + 1) % thing.geometry.frameCount!
                        //console.log(thing.geometry.frame)
                    }
                })
                lastAnim = now
            }

            if (Key.isDown(Key.UP)) forward(player, deltaTime * 500)
            if (Key.isDown(Key.LEFT)) geometry.rotation += deltaTime * 3
            if (Key.isDown(Key.DOWN)) forward(player, -deltaTime * 500)
            if (Key.isDown(Key.RIGHT)) geometry.rotation -= deltaTime * 3
            if (Key.isDown(Key.Q)) geometry.position[1] += deltaTime * 500
            if (Key.isDown(Key.A)) geometry.position[1] -= deltaTime * 500

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
