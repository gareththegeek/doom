import { BufferSetParams } from 'doom-video/dist/buffers/BufferSetParams'
import { FaceData, LineLoop, SectorData } from './interfaces/SectorData'
import { Line, Point, Triangulator } from 'pnltri'
import { vec2, vec3 } from 'gl-matrix'
import { pointInPolygon } from './pointInPolygon'

const triangulateWall = (base: number): number[] => [base + 0, base + 1, base + 2, base + 0, base + 2, base + 3]

const flatVecToPoint = (position3: vec3): Point => ({
    x: position3[0],
    y: position3[2]
})

const flatVec3ToVec2 = (vec3: vec3): vec2 => [vec3[0], vec3[2]]

const findPerimiter = (loops: LineLoop[]): number => {
    const loops2d = loops.map((loop) => loop.position.map(flatVec3ToVec2))
    for (let i = 0; i < loops.length; i++) {
        let isPerimeter = true
        for (let j = 0; j < loops.length; j++) {
            if (i === j) {
                continue
            }

            if (loops2d[i].filter((p) => pointInPolygon(p, loops2d[j])).length > 0) {
                isPerimeter = false
                break
            }
        }
        if (isPerimeter) {
            return i
        }
    }
    throw new Error('No perimeter, what!?')
}

const triangulateFlat = (face: FaceData, base: number): number[] => {
    //TODO floors end up with CCW winding
    const triangulator = new Triangulator()

    const perimeterIndex = face.loops.length === 1 ? 0 : findPerimiter(face.loops)
    const perimeter = face.loops.splice(perimeterIndex, 1)[0]

    const contour = perimeter.position.map(flatVecToPoint)

    let holes: Line[] = []
    if (face.loops.length > 1) {
        holes = face.loops.map((loop) => loop.position.map(flatVecToPoint))
    }
    const result = triangulator.triangulate_polygon([contour, ...holes])
    return result.flatMap((face) => face.map((point) => point + base))
}

const triangulate = (face: FaceData, base: number): number[] =>
    face.isFlat ? triangulateFlat(face, base) : triangulateWall(base)

const buildSectorParams = (sector: SectorData): BufferSetParams => {
    const params: BufferSetParams = { positions: [], indices: [], textures: [], atlas: [] }

    let base = 0
    sector.faces.forEach((face) => {
        const newPositions = face.loops.flatMap((loop) => loop.position)
        const newTextures = face.loops.flatMap((loop) => loop.texture)
        const newAtlas = face.loops.flatMap((loop) => loop.atlas)
        params.positions = params.positions.concat(newPositions)
        params.textures = params.textures.concat(newTextures)
        params.atlas = params.atlas.concat(newAtlas)
        params.indices = params.indices.concat(triangulate(face, base))
        base += newPositions.length
    })

    return params
}

export const createSectorBufferSetParams = (sectorlist: SectorData[]): BufferSetParams[] =>
    sectorlist.map((sector) => buildSectorParams(sector))
