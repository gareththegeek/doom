import { updateBufferSet } from 'doom-video'
import { MapSector } from '..'

export const updateSingleSectorGeometry = (sector: MapSector): void => {
    if (sector.geometryParams === undefined || sector.geometry === undefined) {
        console.warn(`Trying to update non-existant sector geometry for sector ${sector.index}`)
        return
    }

    updateBufferSet(sector.geometry.buffers, sector.geometryParams)
}
