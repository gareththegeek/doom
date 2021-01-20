import { WadLump } from './WadLump'

export interface WadVertex {
    x: number,
    y: number
}

export interface WadVertexLump extends WadLump {
    vertices: WadVertex[]
}
