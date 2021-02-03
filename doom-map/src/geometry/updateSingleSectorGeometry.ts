import { BufferSetParams, updateBufferSet } from 'doom-video'
import { Sector } from '..'

export const updateSingleSectorGeometry = (sector: Sector, params: BufferSetParams): void => {
    if (sector.geometry === undefined) {
        console.warn(`Trying to update non-existant sector geometry for sector ${sector.index}`)
        return
    }

    updateBufferSet(sector.geometry.buffers, params)
}
