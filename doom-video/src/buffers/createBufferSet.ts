import { BufferSet, BufferSetParams } from '..'
import { V } from '../system/global'

const buildBuffer = (target: number, data: ArrayBuffer): WebGLBuffer => {
    const { gl } = V
    const buffer = gl.createBuffer()
    if (!buffer) {
        throw new Error('Unable to create buffer')
    }

    gl.bindBuffer(target, buffer)
    gl.bufferData(target, data, gl.STATIC_DRAW)

    return buffer
}

export const createBufferSet = ({ positions, indices, textures, atlas }: BufferSetParams): BufferSet => ({
    vertexCount: indices.length,
    position: buildBuffer(V.gl.ARRAY_BUFFER, new Float32Array(positions.map((vec) => Array.from(vec)).flat())),
    index: buildBuffer(V.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices)),
    texture: buildBuffer(V.gl.ARRAY_BUFFER, new Float32Array(textures.map((vec) => Array.from(vec)).flat())),
    atlas: buildBuffer(V.gl.ARRAY_BUFFER, new Float32Array(atlas.map((vec) => Array.from(vec)).flat()))
})
