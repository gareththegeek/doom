import { Map } from './interfaces/Map'
import { WadMapLump } from 'doom-wad/dist/interfaces/WadMapLump'
import { TextureAtlas } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { createBlockMap, createLines, createSectors, createThings } from './structures'
import { createSectorGeometry, createSectorGeometryData, createSectorBufferSetParams } from './geometry'
import { MapFlags } from './interfaces/MapFlags'

export const createMap = (
    atlas: TextureAtlas,
    wadMap: WadMapLump,
    flags: MapFlags
): Map => {
    const sectors = createSectors(wadMap)
    const lines = createLines(wadMap, sectors)
    const blockmap = createBlockMap(wadMap.blockmap, lines)
    const data = createSectorGeometryData(atlas, wadMap.vertices, sectors)
    const params = createSectorBufferSetParams(data)
    const things = createThings(atlas, wadMap, sectors, data, blockmap, flags)
    createSectorGeometry(sectors, params)

    return {
        sectors,
        lines,
        blockmap,
        things,
        vertices: wadMap.vertices
    }
}
