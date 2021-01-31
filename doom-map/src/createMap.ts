import { Map } from './interfaces/Map'
import { createBlockMap, createLines, createSectors, createThings } from './structures'
import { createSectorGeometry, createSectorGeometryData, createSectorBufferSetParams } from './geometry'
import { MapFlags } from './interfaces/MapFlags'
import { M } from './global'

export const createMap = (mapName: string, flags: MapFlags): Map => {
    const wadMap = M.wad.maps[mapName]
    M.vertices = wadMap.vertices
    const sectors = createSectors(wadMap)
    const lines = createLines(wadMap, sectors)
    const blockmap = createBlockMap(wadMap.blockmap, lines)
    const data = createSectorGeometryData(sectors)
    const params = createSectorBufferSetParams(data)
    const things = createThings(wadMap, sectors, data, blockmap, flags)
    createSectorGeometry(sectors, params)

    M.map = {
        sectors,
        lines,
        blockmap,
        things,
        vertices: wadMap.vertices
    }
    return M.map
}
