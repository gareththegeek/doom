import { initialiseVideoSystem } from 'doom-video'
import { initialiseMapSystem } from 'doom-map'
import { initialiseSpriteSystem } from 'doom-sprite'
import { fetchWad } from 'doom-wad'
import { createAtlas } from 'doom-atlas'
import { loadMap } from './maps/loadMap'
import { render } from './loops/render'
import { update } from './loops/update'
import './activation'
import './input'
import './cheats'

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
        initialiseSpriteSystem(wad.sprites, atlas)
        console.info('Initialised subsystems')

        loadMap('e1m1')

        const onFrame = (now: number) => {
            update(now)
            render(now)
            requestAnimationFrame(onFrame)
        }
        requestAnimationFrame(onFrame)
    } catch (e) {
        console.error(e.message)
    }
}

window.onload = main
