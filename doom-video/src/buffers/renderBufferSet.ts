import { Geometry } from '../interfaces/Geometry'
import { V } from '../system/global'

const INDICES_PER_FRAME = 6
const SHORT_SIZE = 2

export const renderBufferSet = (geometry: Geometry): void => {
    const { gl } = V
    const start = geometry.flat ? geometry.frame! * INDICES_PER_FRAME : 0
    const count = geometry.flat ? INDICES_PER_FRAME : geometry.buffers.vertexCount
    gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, start * SHORT_SIZE)
}
