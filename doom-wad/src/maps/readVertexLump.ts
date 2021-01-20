import { WadDirectoryEntry } from '../interfaces/WadDirectory'
import { WadVertex, WadVertexLump } from '../interfaces/WadVertexLump'

const VERTEX_SIZE = 4

const VertexOffset = {
    x: 0,
    y: 2
}

const readVertex = (data: Buffer, offset: number): WadVertex => ({
    x: data.readInt16LE(offset + VertexOffset.x),
    y: data.readInt16LE(offset + VertexOffset.y)
})

export const readVertexLump = (data: Buffer, entry: WadDirectoryEntry): WadVertexLump => {
    const length = entry.size / VERTEX_SIZE
    const vertices = []
    for (let i = 0; i < length; i++) {
        vertices.push(readVertex(data, entry.filepos + i * VERTEX_SIZE))
    }
    return { vertices }
}
