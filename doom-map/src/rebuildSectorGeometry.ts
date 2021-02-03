import { Sector } from '.'
import {
    createSingleSectorGeometryData,
    createSingleSectorBufferSetParams,
    updateSingleSectorGeometry
} from './geometry'

export const rebuildSectorGeometry = (sector: Sector): void => {
    const data = createSingleSectorGeometryData(sector)
    const params = createSingleSectorBufferSetParams(data)
    updateSingleSectorGeometry(sector, params)
    sector.dirty = false
}
