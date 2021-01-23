import { BufferSetParams } from 'doom-video/dist/buffers/BufferSetParams'
import { FaceData, SectorData } from './interfaces/SectorData'
import { Triangulator } from 'pnltri'

const triangulateWall = (face: FaceData, base: number): number[] => [
    base + 0,
    base + 1,
    base + 2,
    base + 0,
    base + 2,
    base + 3
]

const triangulateFlat = (face: FaceData, base: number): number[] => {
    //TODO floors end up with CCW winding
    const triangulator = new Triangulator()
    const contour = face.position.map((coord) => ({ x: coord[0], y: coord[2] }))
    return triangulator.triangulate_polygon([contour]).flatMap((face) => face.map((point) => point + base))
}

const triangulate = (face: FaceData, base: number): number[] =>
    face.isFlat ? triangulateFlat(face, base) : triangulateWall(face, base)

const buildSectorParams = (sector: SectorData): BufferSetParams => {
    const params: BufferSetParams = { positions: [], indices: [], textures: [] }

    let base = 0
    sector.faces.forEach((face) => {
        params.positions = params.positions.concat(face.position)
        params.textures = params.textures.concat(face.texture)
        //TODO texture bounds
        params.indices = triangulate(face, base)
        base += face.position.length
    })

    return params
}

export const createSectorBufferSetParams = (sectorlist: SectorData[]): BufferSetParams[] =>
    sectorlist.map((sector) => buildSectorParams(sector))
