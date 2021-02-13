import { TextureAtlas, TextureAtlasEntry } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { BufferSetParams, createBufferSet } from 'doom-video'
import { vec4 } from 'gl-matrix'
import { FrameNameLookup } from './interfaces/FrameNameLookup'
import { SpriteFrame } from './interfaces/SpriteFrame'
import { SpriteSheet } from './interfaces/SpriteSheet'
const EPSILON = 0.002
const createFrameParams = (entry: TextureAtlasEntry, base: number, mirror: boolean): BufferSetParams => {
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
        textures: mirror
            ? [
                  [1 - EPSILON, 0 + EPSILON],
                  [1 - EPSILON, 1 - EPSILON],
                  [0 + EPSILON, 1 - EPSILON],
                  [0 + EPSILON, 0 + EPSILON]
              ]
            : [
                  [0 + EPSILON, 0 + EPSILON],
                  [0 + EPSILON, 1 - EPSILON],
                  [1 - EPSILON, 1 - EPSILON],
                  [1 - EPSILON, 0 + EPSILON]
              ],
        atlas: [atlasCoord, atlasCoord, atlasCoord, atlasCoord],
        sky: [0, 0, 0, 0]
    }
}

const ordinalToIndex = (ordinal: string): number => ordinal.charCodeAt(0) - 'a'.charCodeAt(0)

const getOrdinalAngles = (name: string): { ordinal: string; angle: number }[] => {
    const result = []
    for (let i = 4; i < name.length; i += 2) {
        result.push({ ordinal: name[i], angle: parseInt(name[i + 1]) })
    }
    return result
}

export const createSpriteSheet = (atlas: TextureAtlas, baseName: string): SpriteSheet => {
    // TODO this code is an abomination and should be redone so it doesn't sicken me
    const frameNames = Object.keys(atlas.lookup)
        .filter((other) => other.startsWith(baseName))
        .sort()

    const frameLookup: FrameNameLookup = {}
    const params: BufferSetParams = {
        positions: [],
        indices: [],
        textures: [],
        atlas: [],
        sky: []
    }
    let base = 0
    let frameIndex = 0
    frameNames.forEach((name) => {
        const ordinalAngles = getOrdinalAngles(name)
        ordinalAngles.forEach(({ ordinal, angle }, i) => {
            const index = ordinalToIndex(ordinal)

            const mirror = i > 0
            const frameParams = createFrameParams(atlas.lookup[name], base, mirror)
            params.positions = params.positions.concat(frameParams.positions)
            params.indices = params.indices.concat(frameParams.indices)
            params.textures = params.textures.concat(frameParams.textures)
            params.atlas = params.atlas.concat(frameParams.atlas)
            base += frameParams.positions.length

            if (frameLookup[index] === undefined) {
                frameLookup[index] = {}
            }
            frameLookup[index][angle] = {
                name,
                mirror,
                index: frameIndex,
                height: Math.abs(frameParams.atlas[0][3] - frameParams.atlas[0][1])
            }
            frameIndex += 1
        })
    })

    const frames: SpriteFrame[] = []
    for (const ordinal of Object.values(frameLookup)) {
        const angles = Object.entries(ordinal)
        if (angles.length === 1) {
            frames.push({ angle: new Array(8).fill(angles[0][1].index), height: angles[0][1].height })
            continue
        }
        const frame: SpriteFrame = { angle: [], height: angles[0][1].height }
        angles.forEach((angle) => frame.angle.push(angle[1].index))
        frames.push(frame)
    }

    return {
        frames,
        buffers: createBufferSet(params)
    }
}
