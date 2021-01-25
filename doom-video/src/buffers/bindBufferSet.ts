import { ShaderProgram } from '../shaders/ShaderProgram'
import { BufferSet } from './BufferSet'

const bindArray = (
    gl: WebGL2RenderingContext,
    buffer: WebGLBuffer,
    index: number,
    size: number
): void => {
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.vertexAttribPointer(index, size, type, normalize, stride, offset)
    gl.enableVertexAttribArray(index)
}

export const bindBufferSet = (gl: WebGL2RenderingContext, program: ShaderProgram, buffers: BufferSet): void => {
    bindArray(gl, buffers.position, program.attribLocations.vertexPosition, 3)
    bindArray(gl, buffers.texture, program.attribLocations.textureCoord, 2)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index)
}
