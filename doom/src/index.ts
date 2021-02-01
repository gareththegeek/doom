import { vec2 } from 'gl-matrix'
import { initialiseVideoSystem, renderScene } from 'doom-video'
import { fetchWad } from 'doom-wad'
import { createAtlas } from 'doom-atlas'
import { Thing, initialiseMapSystem } from 'doom-map'
import { collisionCheck } from './collisions/collisionCheck'
import { G } from './global'
import { loadMap } from './maps/loadMap'
import { isPressed } from './input/isPressed'
require('./game/activate')
require('./input')
require('./cheats')

const forward = (thing: Thing | undefined, speed: number): void => {
    const {
        map,
        cheats: { noclip }
    } = G

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
        initialiseVideoSystem(gl, atlas.image, ATLAS_SIZE, wad.playpal.palettes[0].colours, wad.colormap.maps)
        initialiseMapSystem(wad, atlas)
        console.info('Built textures')

        loadMap('e1m1')

        // let last = 0
        let then = 0
        let lastAnim = 0
        const render = (now: number) => {
            now *= 0.001
            const deltaTime = now - then
            then = now

            const { player, map } = G

            const geometry = player!.geometry!

            // TODO use doom state and ticks to manage this and ideally move animation logic to doom-video
            if (now - lastAnim > 0.2) {
                map.things.forEach((thing) => {
                    if (thing.geometry !== undefined) {
                        thing.geometry.frame = (thing.geometry.frame! + 1) % thing.geometry.frameCount!
                        //console.log(thing.geometry.frame)
                    }
                })
                lastAnim = now
            }

            if (isPressed('ArrowUp')) forward(player, deltaTime * 500)
            if (isPressed('ArrowLeft')) geometry.rotation += deltaTime * 3
            if (isPressed('ArrowDown')) forward(player, -deltaTime * 500)
            if (isPressed('ArrowRight')) geometry.rotation -= deltaTime * 3
            if (isPressed('q')) geometry.position[1] += deltaTime * 500
            if (isPressed('a')) geometry.position[1] -= deltaTime * 500

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
