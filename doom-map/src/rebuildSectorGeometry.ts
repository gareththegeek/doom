import { Sector } from '.'
import {
    createSingleSectorGeometryData,
    createSingleSectorBufferSetParams,
    createSingleSectorGeometry
} from './geometry'

export const rebuildSectorGeometry = (sector: Sector): void => {
    const data = createSingleSectorGeometryData(sector)
    const params = createSingleSectorBufferSetParams(data)
    createSingleSectorGeometry(sector, params)
    sector.dirty = false
}
