import { BufferSetParams, createBufferSet } from 'doom-video'
import { vec3 } from 'gl-matrix'
import { MapSector } from '..'
import { SectorGeometryData } from '../interfaces/SectorGeometryData'

export const createSingleSectorGeometry = (sector: MapSector, params: BufferSetParams): void => {
    sector.geometry = {
        position: [0.0, 0.0, 0.0] as vec3,
        rotation: 0,
        buffers: createBufferSet(params),
        flat: false,
        visible: true,
        screenspace: false,
        light: sector.lightLevel
    }
}

export const createSectorGeometry = (
    sectors: MapSector[],
    params: BufferSetParams[],
    data: SectorGeometryData[]
): void => {
    params.forEach((params, index) => {
        const sector = sectors[index]
        sector.geometryParams = params
        sector.geometryData = data[index]
        createSingleSectorGeometry(sector, params)
        sector.dirty = false
    })
}
