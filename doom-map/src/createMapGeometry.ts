import { TextureAtlas } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { createSectorBufferSetParams } from './createSectorBufferSetParams'
import { createSectorBufferSets } from './createSectorBufferSets'
import { buildSectorList } from './buildSectorList'
import { SectorInfo } from './interfaces/SectorInfo'
import { findSectorsThings } from './findSectorsThings'

export const createMapGeometry = (
    gl: WebGL2RenderingContext,
    wad: Wad,
    atlas: TextureAtlas,
    name: string
): SectorInfo[] => {
    const wadmap = wad.maps[name]
    if (!wadmap) {
        throw new Error(`Unable to locate map ${name}`)
    }
    const sectorlist = buildSectorList(wadmap, atlas)
    const things = findSectorsThings(sectorlist, wadmap.things)
    const params = createSectorBufferSetParams(sectorlist)
    const bufferSets = createSectorBufferSets(gl, params)
    return bufferSets.map((buffers, index) => ({
        buffers,
        things: things[index]
    }))
}
