import { BufferSetParams } from 'doom-video/dist/buffers/BufferSetParams'
import { FaceData, SectorData } from './interfaces/SectorData'
import { Triangulator } from 'pnltri'

const triangulate = (face: FaceData, base: number): number[] => {
    const triangulator = new Triangulator()
    const contour = face.position.map((coord) => ({ x: coord[0], y: coord[2] }))
    const result = triangulator.triangulate_polygon([contour])
    debugger
    return []
}

const buildSectorParams = (sector: SectorData): BufferSetParams => {
    const params: BufferSetParams = { positions: [], indices: [], textures: [] }

    let base = 0
    sector.faces.forEach((face) => {
        params.positions.concat(face.position)
        params.textures.concat(face.texture)
        //TODO texture bounds
        params.indices = triangulate(face, base)
        base += face.position.length
    })

    return params
}

export const createSectorBufferSetParams = (sectorlist: SectorData[]): BufferSetParams[] =>
    sectorlist.map((sector) => buildSectorParams(sector))
