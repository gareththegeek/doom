import { createBufferSet } from 'doom-video'
import { BufferSetParams } from 'doom-video/dist/buffers/BufferSetParams'
import { vec3 } from 'gl-matrix'
import { Sector } from '..'

export const createSingleSectorGeometry = (
    gl: WebGL2RenderingContext,
    sector: Sector,
    params: BufferSetParams
): void => {
    sector.geometry = {
        position: [0.0, 0.0, 0.0] as vec3,
        rotation: 0,
        buffers: createBufferSet(gl, params),
        flat: false,
        visible: true,
        light: sector.lightLevel
    }
}

export const createSectorGeometry = (
    gl: WebGL2RenderingContext,
    sectors: Sector[],
    params: BufferSetParams[]
): void => {
    params.forEach((params, index) => {
        createSingleSectorGeometry(gl, sectors[index], params)
    })
}
