import { BufferSetParams } from 'doom-video'
import { MapSector } from '..'
import { LineLoop } from '../interfaces/SectorGeometryData'

const copyPoint = (loop: LineLoop, i: number, params: BufferSetParams, j: number): void => {
    params.positions[j][0] = loop.position[i][0]
    params.positions[j][1] = loop.position[i][1]
    params.positions[j][2] = loop.position[i][2]
    params.textures[j][0] = loop.texture[i][0]
    params.textures[j][1] = loop.texture[i][1]
    params.atlas[j][0] = loop.atlas[i][0]
    params.atlas[j][1] = loop.atlas[i][1]
    params.atlas[j][2] = loop.atlas[i][2]
    params.atlas[j][3] = loop.atlas[i][3]
    params.sky[j] = loop.sky[i]
}

export const updateSingleSectorGeometryParams = (sector: MapSector): void => {
    let vertexIndex = 0
    for (const face of sector.geometryData.faces) {
        for (let i = 0; i < face.contour.position.length; i++) {
            copyPoint(face.contour, i, sector.geometryParams, vertexIndex++)
        }
        for (const hole of face.holes) {
            for (let i = 0; i < hole.position.length; i++) {
                copyPoint(hole, i, sector.geometryParams, vertexIndex++)
            }
        }
    }
}
