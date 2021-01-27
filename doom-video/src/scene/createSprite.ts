import { vec4 } from 'gl-matrix'
import { TextureAtlas } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { createBufferSet } from '../buffers'
import { Geometry } from './Geometry'

export const createSprite = (gl: WebGL2RenderingContext, atlas: TextureAtlas, name: string): Geometry => {
    //trooa1 41x57
    const entry = atlas.lookup[name]
    const atlasCoord: vec4 = [entry.left, entry.bottom, entry.right, entry.top]
    const hx = entry.pixelWidth / 2
    const he = entry.pixelHeight
    const buffers = createBufferSet(gl, {
        positions: [
            [0 - hx, 0, 0],
            [0 - hx, he, 0],
            [0 + hx, he, 0],
            [0 + hx, 0, 0]
        ],
        indices: [0, 1, 2, 0, 2, 3],
        textures: [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0]
        ],
        atlas: [atlasCoord, atlasCoord, atlasCoord, atlasCoord]
    })

    return {
        position: [0, 0, 0],
        rotation: 0,
        buffers,
        flat: true,
        light: 144 //TODO
    }
}
