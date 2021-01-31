import { V } from '../system/global'
import { BufferSet } from '..'

const bindArray = (buffer: WebGLBuffer, index: number, size: number): void => {
    const { gl } = V
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.vertexAttribPointer(index, size, type, normalize, stride, offset)
    gl.enableVertexAttribArray(index)
}

export const bindBufferSet = (buffers: BufferSet): void => {
    const {
        gl,
        resources: { program }
    } = V
    bindArray(buffers.position, program.attribLocations.vertexPosition, 3)
    bindArray(buffers.texture, program.attribLocations.textureCoord, 2)
    bindArray(buffers.atlas, program.attribLocations.atlasCoord, 4)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index)
}
