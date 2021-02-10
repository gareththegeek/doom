import { MapSector } from '.'
import { updateSingleSectorData, updateSingleSectorGeometry, updateSingleSectorGeometryParams } from './geometry'

export const rebuildSectorGeometry = (sector: MapSector): void => {
    //if (sector.index !== 26) return
    updateSingleSectorData(sector)
    updateSingleSectorGeometryParams(sector)
    updateSingleSectorGeometry(sector)
    sector.dirty = false
}
