import { createBufferSet } from 'doom-video'
import { BufferSet } from 'doom-video/dist/buffers/BufferSet'
import { BufferSetParams } from 'doom-video/dist/buffers/BufferSetParams'

export const createSectorBufferSets = (gl: WebGL2RenderingContext, params: BufferSetParams[]): BufferSet[] =>
    params.map((vertices) => createBufferSet(gl, vertices))
