import { TextureAtlas } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { Sector, Map } from '.'
import {
    createSingleSectorGeometryData,
    createSingleSectorBufferSetParams,
    createSingleSectorGeometry
} from './geometry'

export const rebuildSectorGeometry = (
    atlas: TextureAtlas,
    map: Map,
    sector: Sector
): void => {
    const data = createSingleSectorGeometryData(atlas, map.vertices, sector)
    const params = createSingleSectorBufferSetParams(data)
    createSingleSectorGeometry(sector, params)
}
