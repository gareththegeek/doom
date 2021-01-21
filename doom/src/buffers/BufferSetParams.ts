import { vec2, vec3 } from 'gl-matrix'

export interface BufferSetParams {
    positions: vec3[]
    indices: number[]
    textures: vec2[]
}
