import { BufferSet } from './BufferSet'

export const renderBufferSet = (gl: WebGLRenderingContext, { vertexCount }: BufferSet): void => {
    gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, 0)
}
