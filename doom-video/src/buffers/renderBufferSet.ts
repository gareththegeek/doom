import { Geometry } from '../interfaces/Geometry'
import { V } from '../system/global'

const SHORT_SIZE = 2

export const renderBufferSet = (geometry: Geometry): void => {
    const { gl } = V
    const start = geometry.startIndex ?? 0
    const count = geometry.indexCount ?? geometry.buffers.vertexCount
    gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, start * SHORT_SIZE)
}
