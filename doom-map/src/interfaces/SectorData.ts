import { vec2, vec3 } from 'gl-matrix'

export interface FaceData {
    position: vec3[]
    textureBounds: number[]
    texture: vec2[]
    isFlat: boolean
}

export interface SectorData {
    faces: FaceData[]
    adjacency: number[][]
}
