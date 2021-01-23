import { createBufferSet } from 'doom-video'
import { BufferSetParams } from 'doom-video/dist/buffers/BufferSetParams'

export const createSectorBuffers = (gl: WebGLRenderingContext, params: BufferSetParams[]) => 
    params.map(vertices => createBufferSet(gl, vertices))
