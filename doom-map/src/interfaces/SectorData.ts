import { vec2, vec3 } from 'gl-matrix'

export interface LineLoop {
    position: vec3[]
    textureBounds: number[]
    texture: vec2[]
}

export interface FaceData {
    loops: LineLoop[]
    isFlat: boolean
}

export interface SectorData {
    faces: FaceData[]
    adjacency: number[][]
}
