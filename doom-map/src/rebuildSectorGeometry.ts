import { TextureAtlas } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { Sector, Map } from '.'
import {
    createSingleSectorGeometryData,
    createSingleSectorBufferSetParams,
    createSingleSectorGeometry
} from './geometry'

export const rebuildSectorGeometry = (
    gl: WebGL2RenderingContext,
    atlas: TextureAtlas,
    map: Map,
    sector: Sector
): void => {
    const data = createSingleSectorGeometryData(atlas, map.vertices, sector)
    const params = createSingleSectorBufferSetParams(data)
    createSingleSectorGeometry(gl, sector, params)
}
