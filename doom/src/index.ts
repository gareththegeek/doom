import { vec2 } from 'gl-matrix'
import { initialiseSystem, renderScene, createScene } from 'doom-video'
import { fetchWad } from 'doom-wad'
import { createAtlas } from 'doom-atlas'
import { createMap, Thing, Map, Line, rebuildSectorGeometry } from 'doom-map'
import { collisionCheck } from './collisions/collisionCheck'
import { use } from './collisions/use'
import { SkillType } from 'doom-map/dist/interfaces/MapFlags'
import { ActivateLookup } from './game/activate'
import { getAdjacenctSectors } from './getAdjacentSectors'

let noclip = false
let loadMap: (mapName: string) => any
let player: Thing | undefined
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
        const ATLAS_SIZE = 4096
        const atlas = createAtlas(wad, ATLAS_SIZE)
        initialiseSystem(gl, atlas.image, ATLAS_SIZE, wad.playpal.palettes[0].colours, wad.colormap.maps)
        console.info('Built textures')

        loadMap = (mapName: string) => {
            console.info(`Loading map ${mapName}`)
            const wadMap = wad.maps[mapName]
            map = createMap(atlas, wadMap, { multiplayer: false, skill: SkillType.skill45 })
            console.info('Configuring player')
            player = map.things.find((thing) => thing.type === 1)
            if (player === undefined || player.geometry === undefined) {
                throw new Error('Unable to find player start in level D:')
            }
            player.geometry.visible = false
            const objects = [...map.sectors.map((sector) => sector), ...map.things.map((thing) => thing)]
            createScene(objects, player.geometry, [0, 48, 0])
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
                    rebuildSectorGeometry(atlas, map, sector)
                    adjacent.forEach((sector) => rebuildSectorGeometry(atlas, map, sector))
                }, 1000 / 35)
            }
        }

        loadMap('e1m1')

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

            renderScene()

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
