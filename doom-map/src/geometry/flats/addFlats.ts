import { TextureAtlasEntry } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { WadVertex } from 'doom-wad/dist/interfaces/WadVertexLump'
import { M } from '../../global'
import { MapSector } from '../../interfaces/MapSector'
import { LineLoop, SectorGeometryData } from '../../interfaces/SectorGeometryData'
import { findPerimeterIndices, insidePerimeter } from './findPerimeters'
import { processLoops } from './processLoops'

const FLAT_SIZE = 64

const buildFlat = (vertices: WadVertex[], y: number, texture: TextureAtlasEntry, isSky = false): LineLoop => {
    return {
        position: vertices.map((vertex) => [vertex.x, y, -vertex.y]),
        texture: vertices.map((vertex) => [1 - vertex.y / FLAT_SIZE, vertex.x / FLAT_SIZE]),
        atlas: vertices.map(() => [texture.left, texture.top, texture.right, texture.bottom]),
        sky: vertices.map(() => (isSky ? 1 : 0))
    }
}

export const addFlats = ({ adjacency, faces }: SectorGeometryData, sector: MapSector): void => {
    const { atlas, vertices } = M
    const loopIndices = processLoops(adjacency).filter((loop) => loop.length > 2)
    const vertexLoops = loopIndices.map((indices) => indices.map((index) => vertices[index]))
    const perimeterIndices = findPerimeterIndices(vertexLoops)

    const loops = perimeterIndices.map((perimeterIndex) => ({
        contour: vertexLoops[perimeterIndex],
        holes: vertexLoops.filter((vl, i) => i !== perimeterIndex && insidePerimeter(vertexLoops[perimeterIndex], vl))
    }))

    loops.map((loop) => {
        const floorTexture = atlas.lookup[sector.floorTexture]
        const isSky = sector.ceilingTexture === 'f_f_sky1'
        const ceilingTexture = isSky
            ? atlas.lookup['sky1'] //TODO how do we know what sky we're using? is it by episode?
            : atlas.lookup[sector.ceilingTexture]
        faces.push({
            isFlat: true,
            isCeiling: false,
            contour: buildFlat(loop.contour, sector.floorHeight, floorTexture),
            holes: loop.holes.map((hole) => buildFlat(hole, sector.floorHeight, floorTexture))
        })
        faces.push({
            isFlat: true,
            isCeiling: true,
            contour: buildFlat(loop.contour, sector.ceilingHeight, ceilingTexture, isSky),
            holes: loop.holes.map((hole) => buildFlat(hole, sector.ceilingHeight, ceilingTexture, isSky))
        })
    })
}
