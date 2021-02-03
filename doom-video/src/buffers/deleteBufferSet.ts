import { BufferSet } from '..'
import { V } from '../system/global'

export const deleteBufferSet = ({ atlas, index, position, texture }: BufferSet) => {
    const { gl } = V
    gl.deleteBuffer(atlas)
    gl.deleteBuffer(index)
    gl.deleteBuffer(position)
    gl.deleteBuffer(texture)
}
