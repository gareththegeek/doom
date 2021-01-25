import { vec2, vec3, vec4 } from 'gl-matrix'

export interface LineLoop {
    position: vec3[]
    texture: vec2[]
    atlas: vec4[]
}

export interface FaceData {
    loops: LineLoop[]
    isFlat: boolean
}

export interface SectorData {
    faces: FaceData[]
    adjacency: number[][]
}
