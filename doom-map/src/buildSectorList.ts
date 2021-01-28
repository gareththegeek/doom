import { TextureAtlas, TextureAtlasEntry } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { WadLineDefFlags } from 'doom-wad/dist/interfaces/WadLineDefsLump'
import { WadMapLump } from 'doom-wad/dist/interfaces/WadMapLump'
import { WadSector } from 'doom-wad/dist/interfaces/WadSectorsLump'
import { WadSideDef } from 'doom-wad/dist/interfaces/WadSideDefsLump'
import { WadVertex } from 'doom-wad/dist/interfaces/WadVertexLump'
import { vec2 } from 'gl-matrix'
import { findPerimeterIndices, insidePerimeter } from './findPerimeters'
import { FaceData, LineLoop, SectorData } from './interfaces/SectorData'
import { processLoops } from './processLoops'

const buildFace = (
    start: WadVertex,
    end: WadVertex,
    bottom: number,
    top: number,
    sectorTop: number,
    texture: TextureAtlasEntry,
    textureOrigin: TextureOriginType,
    xoffset: number,
    yoffset: number
): FaceData => {
    const width = vec2.length([end.x - start.x, end.y - start.y])
    const height = top - bottom

    const { pixelWidth, pixelHeight } = texture

    let pinning = 0
    switch (textureOrigin) {
        case TextureOriginType.Bottom: {
            pinning = pixelHeight - height
            break
        }
        case TextureOriginType.SectorTop: {
            pinning = sectorTop - top
            break
        }
    }

    const xoffs = xoffset / pixelWidth
    const yoffs = (yoffset + pinning) / pixelHeight
    const x0 = xoffs
    const y0 = yoffs
    const x1 = xoffs + width / pixelWidth
    const y1 = yoffs + height / pixelHeight

    const bounds: [number, number, number, number] = [texture.left, texture.top, texture.right, texture.bottom]
    return {
        isFlat: false,
        isCeiling: false,
        holes: [],
        contour: {
            position: [
                [start.x, bottom, -start.y],
                [start.x, top, -start.y],
                [end.x, top, -end.y],
                [end.x, bottom, -end.y]
            ],
            texture: [
                [x0, y1],
                [x0, y0],
                [x1, y0],
                [x1, y1]
            ],
            atlas: [[...bounds], [...bounds], [...bounds], [...bounds]]
        }
    }
}

const FLAT_SIZE = 64

const buildFlat = (vertices: WadVertex[], y: number, texture: TextureAtlasEntry): LineLoop => {
    return {
        position: vertices.map((vertex) => [vertex.x, y, -vertex.y]),
        texture: vertices.map((vertex) => [1 - vertex.y / FLAT_SIZE, vertex.x / FLAT_SIZE]),
        atlas: vertices.map(() => [texture.left, texture.top, texture.right, texture.bottom])
    }
}

const hasMiddle = (sidedef: WadSideDef): boolean => sidedef.middleTexture !== '-'

const hasUpper = (sidedef: WadSideDef, front: WadSector, back?: WadSector): boolean =>
    !!back && front.ceilingHeight > back.ceilingHeight && sidedef.upperTexture !== '-'

const hasLower = (sidedef: WadSideDef, front: WadSector, back?: WadSector): boolean =>
    !!back && front.floorHeight < back.floorHeight && sidedef.lowerTexture !== '-'

enum TextureOriginType {
    Top = 0,
    Bottom,
    SectorTop
}

const processSidedef = (
    atlas: TextureAtlas,
    faces: FaceData[],
    sidedef: WadSideDef,
    start: WadVertex,
    end: WadVertex,
    flags: WadLineDefFlags,
    frontSector: WadSector,
    backSector: WadSector | undefined
): void => {
    if (hasMiddle(sidedef)) {
        faces.push(
            buildFace(
                start,
                end,
                frontSector.floorHeight,
                frontSector.ceilingHeight,
                0,
                atlas.lookup[sidedef.middleTexture],
                flags.lowerUnpegged ? TextureOriginType.Bottom : TextureOriginType.Top,
                sidedef.xoffset,
                sidedef.yoffset
            )
        )
    }
    if (hasUpper(sidedef, frontSector, backSector)) {
        faces.push(
            buildFace(
                start,
                end,
                backSector!.ceilingHeight,
                frontSector.ceilingHeight,
                0,
                atlas.lookup[sidedef.upperTexture],
                flags.upperUnpegged ? TextureOriginType.Top : TextureOriginType.Bottom,
                sidedef.xoffset,
                sidedef.yoffset
            )
        )
    }
    if (hasLower(sidedef, frontSector, backSector)) {
        faces.push(
            buildFace(
                start,
                end,
                frontSector.floorHeight,
                backSector!.floorHeight,
                frontSector.ceilingHeight,
                atlas.lookup[sidedef.lowerTexture],
                flags.lowerUnpegged ? TextureOriginType.SectorTop : TextureOriginType.Top,
                sidedef.xoffset,
                sidedef.yoffset
            )
        )
    }
}

const addWalls = (sectorlist: SectorData[], map: WadMapLump, atlas: TextureAtlas): void => {
    map.linedefs.forEach((linedef) => {
        const start = map.vertices[linedef.start]
        const end = map.vertices[linedef.end]

        const front = linedef.front === -1 ? undefined : map.sidedefs[linedef.front]
        const back = linedef.back === -1 ? undefined : map.sidedefs[linedef.back]

        const frontSector = front === undefined ? undefined : map.sectors[front.sector]
        const backSector = back === undefined ? undefined : map.sectors[back.sector]

        if (!!front && !!frontSector) {
            const { adjacency, faces } = sectorlist[front.sector]
            adjacency.push([linedef.start, linedef.end])
            processSidedef(atlas, faces, front, start, end, linedef.flags, frontSector, backSector)
        }
        if (!!back && !!backSector) {
            const { adjacency, faces } = sectorlist[back.sector]
            adjacency.push([linedef.end, linedef.start])
            processSidedef(atlas, faces, back, end, start, linedef.flags, backSector, frontSector)
        }
    })
}

const addFlats = (sectorlist: SectorData[], map: WadMapLump, atlas: TextureAtlas): void => {
    map.sectors.forEach((sector, index) => {
        const { adjacency, faces } = sectorlist[index]

        const loopIndices = processLoops(adjacency)
        const vertexLoops = loopIndices.map((indices) => indices.map((index) => map.vertices[index]))
        const perimeterIndices = findPerimeterIndices(vertexLoops)

        const loops = perimeterIndices.map((perimeterIndex) => ({
            contour: vertexLoops[perimeterIndex],
            holes: vertexLoops.filter(
                (vl, i) => i !== perimeterIndex && insidePerimeter(vertexLoops[perimeterIndex], vl)
            )
        }))

        loops.map((loop) => {
            const floorTexture = atlas.lookup[sector.floorTexture]
            const ceilingTexture = atlas.lookup[sector.ceilingTexture]
            faces.push({
                isFlat: true,
                isCeiling: false,
                contour: buildFlat(loop.contour, sector.floorHeight, floorTexture),
                holes: loop.holes.map((hole) => buildFlat(hole, sector.floorHeight, floorTexture))
            })
            faces.push({
                isFlat: true,
                isCeiling: true,
                contour: buildFlat(loop.contour, sector.ceilingHeight, ceilingTexture),
                holes: loop.holes.map((hole) => buildFlat(hole, sector.ceilingHeight, ceilingTexture))
            })
        })
    })
}

export const buildSectorList = (map: WadMapLump, atlas: TextureAtlas): SectorData[] => {
    const sectorlist = map.sectors.map(() => ({ adjacency: [], faces: [] }))

    addWalls(sectorlist, map, atlas)
    addFlats(sectorlist, map, atlas)

    return sectorlist
}
