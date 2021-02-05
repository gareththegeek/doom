import { vec2, vec3, vec4 } from 'gl-matrix'

export interface BufferSetParams {
    positions: vec3[]
    indices: number[]
    textures: vec2[]
    atlas: vec4[]
    sky: number[]
}
