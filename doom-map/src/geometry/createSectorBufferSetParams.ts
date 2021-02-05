import { BufferSetParams } from 'doom-video'
import { FaceData, SectorGeometryData } from '../interfaces/SectorGeometryData'
import { Point, Triangulator } from 'pnltri'
import { vec3 } from 'gl-matrix'

const triangulateWall = (base: number): number[] => [base + 0, base + 1, base + 2, base + 0, base + 2, base + 3]

const flatVecToPoint = (position3: vec3): Point => ({
    x: position3[0],
    y: position3[2]
})

const triangulateFlat = (face: FaceData, base: number): number[] => {
    const triangulator = new Triangulator()

    const contour = face.contour.position.map(flatVecToPoint)
    const holes = face.holes.map((hole) => hole.position.map(flatVecToPoint))

    const result = triangulator.triangulate_polygon([contour, ...holes])
    return result.flatMap((face) => face.map((point) => point + base))
}

const triangulate = (face: FaceData, base: number): number[] =>
    face.isFlat ? triangulateFlat(face, base) : triangulateWall(base)

const MAX_TRIANGULATION_RETRIES = 5

export const createSingleSectorBufferSetParams = (sector: SectorGeometryData, i = 0): BufferSetParams => {
    const params: BufferSetParams = { positions: [], indices: [], textures: [], atlas: [], sky: [] }
    let base = 0
    sector.faces.forEach((face) => {
        try {
            const all = [face.contour, ...face.holes]
            const newPositions = all.flatMap((loop) => loop.position)
            const newTextures = all.flatMap((loop) => loop.texture)
            const newAtlas = all.flatMap((loop) => loop.atlas)
            const newSky = all.flatMap((loop) => loop.sky)
            let newIndices: number[] = []
            let i = 0
            while (i++ < MAX_TRIANGULATION_RETRIES && newIndices.length === 0) {
                try {
                    newIndices = triangulate(face, base)
                } catch {
                    console.warn(`Retrying triangulation for sector ${i}`)
                }
            }

            params.positions = params.positions.concat(newPositions)
            params.textures = params.textures.concat(newTextures)
            params.atlas = params.atlas.concat(newAtlas)
            params.sky = params.sky.concat(newSky)
            params.indices = params.indices.concat(face.isCeiling ? newIndices.reverse() : newIndices)

            base += newPositions.length
        } catch (e) {
            console.error(e.message)
            throw new Error(`Error creating buffer set params for sector ${i}`)
        }
    })

    return params
}

export const createSectorBufferSetParams = (sectorlist: SectorGeometryData[]): BufferSetParams[] =>
    sectorlist.map((sector, i) => createSingleSectorBufferSetParams(sector, i))
