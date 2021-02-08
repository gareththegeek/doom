import { BufferSetParams, createBufferSet } from 'doom-video'
import { vec3 } from 'gl-matrix'
import { MapSector } from '..'

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

export const createSectorGeometry = (sectors: MapSector[], params: BufferSetParams[]): void => {
    params.forEach((params, index) => {
        const sector = sectors[index]
        createSingleSectorGeometry(sector, params)
        sector.dirty = false
    })
}
