import { Map } from './interfaces/Map'
import { WadMapLump } from 'doom-wad/dist/interfaces/WadMapLump'
import { TextureAtlas } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { createBlockMap, createLines, createSectors, createThings } from './structures'
import { createSectorBufferSetParams, createSectorBufferSets, createSectorGeometryData } from './geometry'
import { MapFlags } from './interfaces/MapFlags'
import { vec3 } from 'gl-matrix'

export const createMap = (
    gl: WebGL2RenderingContext,
    atlas: TextureAtlas,
    wadMap: WadMapLump,
    flags: MapFlags
): Map => {
    const sectors = createSectors(wadMap)
    const lines = createLines(wadMap, sectors)
    const blockmap = createBlockMap(wadMap.blockmap, lines)
    const data = createSectorGeometryData(atlas, wadMap, sectors)
    const params = createSectorBufferSetParams(data)
    const things = createThings(gl, atlas, wadMap, sectors, data, blockmap, flags)
    const bufferSets = createSectorBufferSets(gl, params)
    sectors.forEach((sector, index) => {
        sector.geometry = {
            position: [0.0, 0.0, 0.0] as vec3,
            rotation: 0,
            buffers: bufferSets[index],
            flat: false,
            visible: true,
            light: sector.lightLevel
        }
    })

    return {
        sectors,
        lines,
        blockmap,
        things
    }
}
