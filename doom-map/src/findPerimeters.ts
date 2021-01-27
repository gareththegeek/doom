import { WadVertex } from 'doom-wad/dist/interfaces/WadVertexLump'
import { vec2 } from 'gl-matrix'
import { pointInPolygon } from './pointInPolygon'

const flatWadVertexToVec2 = (vertex: WadVertex): vec2 => [vertex.x, vertex.y]

export const insidePerimeter = (perimeter: WadVertex[], candidate: WadVertex[]): boolean =>
    candidate.map(flatWadVertexToVec2).filter((p) => pointInPolygon(p, perimeter.map(flatWadVertexToVec2))).length > 0

export const findPerimeterIndices = (loops: WadVertex[][]): number[] => {
    const perimeters = []
    const loops2d = loops.map((loop) => loop.map(flatWadVertexToVec2))
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
            perimeters.push(i)
        }
    }
    return perimeters
}
