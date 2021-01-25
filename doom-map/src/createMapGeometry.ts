import { TextureAtlas } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { BufferSet } from 'doom-video/dist/buffers/BufferSet'
import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { createSectorBufferSetParams } from './createSectorBufferSetParams'
import { createSectorBufferSets } from './createSectorBufferSets'
import { createSectorData } from './createSectorData'

export const createMapGeometry = (gl: WebGL2RenderingContext, wad: Wad, atlas: TextureAtlas, name: string): BufferSet[] => {
    const sectorlist = createSectorData(wad, atlas, name)
    const params = createSectorBufferSetParams(sectorlist)
    return createSectorBufferSets(gl, params)
}
