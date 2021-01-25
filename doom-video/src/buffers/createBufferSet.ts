import { BufferSet } from './BufferSet'
import { BufferSetParams } from './BufferSetParams'

const buildBuffer = (gl: WebGL2RenderingContext, target: number, data: ArrayBuffer): WebGLBuffer => {
    const buffer = gl.createBuffer()
    if (!buffer) {
        throw new Error('Unable to create buffer')
    }

    gl.bindBuffer(target, buffer)
    gl.bufferData(target, data, gl.STATIC_DRAW)

    return buffer
}

export const createBufferSet = (gl: WebGL2RenderingContext, { positions, indices, textures }: BufferSetParams): BufferSet => ({
    vertexCount: indices.length,
    position: buildBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(positions.map((vec) => Array.from(vec)).flat())),
    index: buildBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices)),
    texture: buildBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(textures.map((vec) => Array.from(vec)).flat()))
})
