import { vec2, vec3, vec4 } from 'gl-matrix'

export interface LineLoop {
    position: vec3[]
    texture: vec2[]
    atlas: vec4[]
    sky: number[]
}

export interface FaceData {
    contour: LineLoop
    holes: LineLoop[]
    isFlat: boolean
    isCeiling: boolean
}

export interface SectorGeometryData {
    faces: FaceData[]
    adjacency: number[][]
}
