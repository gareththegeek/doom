import { vec3, vec4 } from 'gl-matrix'
import { TextureAtlas, TextureAtlasEntry } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { createBufferSet } from '../buffers'
import { Geometry } from './Geometry'
import { BufferSetParams } from '../buffers/BufferSetParams'

const INDICES_PER_FRAME = 6

const getAnimationNumber = (atlas: TextureAtlas, name: string, ordinal: string): number =>
    atlas.lookup[`${name}${ordinal}0`] !== undefined ? 0 : 1

const createSpriteFrame = (entry: TextureAtlasEntry, base: number): BufferSetParams => {
    const atlasCoord: vec4 = [entry.left, entry.bottom, entry.right, entry.top]
    const hx = entry.pixelWidth / 2
    const he = entry.pixelHeight
    return {
        positions: [
            [0 - hx, 0, 0],
            [0 - hx, he, 0],
            [0 + hx, he, 0],
            [0 + hx, 0, 0]
        ],
        indices: [base + 0, base + 1, base + 2, base + 0, base + 2, base + 3],
        textures: [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0]
        ],
        atlas: [atlasCoord, atlasCoord, atlasCoord, atlasCoord]
    }
}

export const createSprite = (
    gl: WebGL2RenderingContext,
    atlas: TextureAtlas,
    name: string,
    sequence: string
): Geometry => {
    const number = getAnimationNumber(atlas, name, sequence[0])
    const entries = sequence.split('').map((ordinal) => atlas.lookup[`${name}${ordinal}${number}`])

    const params: BufferSetParams = {
        positions: [],
        indices: [],
        textures: [],
        atlas: []
    }
    let base = 0
    for (let entry of entries) {
        const frame = createSpriteFrame(entry, base)
        params.positions = params.positions.concat(frame.positions)
        params.indices = params.indices.concat(frame.indices)
        params.textures = params.textures.concat(frame.textures)
        params.atlas = params.atlas.concat(frame.atlas)
        base += frame.positions.length
    }
    console.log(params.positions)
    console.log(params.indices)
    console.log(params.textures)
    console.log(params.atlas)

    const buffers = createBufferSet(gl, params)

    return {
        position: [0, 0, 0],
        rotation: 0,
        buffers,
        flat: true,
        light: 0,
        visible: true,
        frame: 0,
        frameCount: entries.length
    }
}
