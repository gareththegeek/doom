import { TextureAtlas, TextureAtlasEntry } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { WadMapLump } from 'doom-wad/dist/interfaces/WadMapLump'
import { WadSector } from 'doom-wad/dist/interfaces/WadSectorsLump'
import { WadSideDef } from 'doom-wad/dist/interfaces/WadSideDefsLump'
import { WadVertex } from 'doom-wad/dist/interfaces/WadVertexLump'
import { vec2 } from 'gl-matrix'
import { FaceData, LineLoop, SectorData } from './interfaces/SectorData'

const buildFace = (
    start: WadVertex,
    end: WadVertex,
    bottom: number,
    top: number,
    texture: TextureAtlasEntry,
    xoffset: number,
    yoffset: number
): FaceData => {
    const width = vec2.length([end.x - start.x, end.y - start.y])
    const height = top - bottom
    //TODO not sure about these offsets - can't really test until proper textures are applied
    const texturex = (width + xoffset) / texture.pixelWidth
    const texturey = (height + yoffset) / texture.pixelHeight
    return {
        isFlat: false,
        loops: [
            {
                position: [
                    [start.x, bottom, -start.y],
                    [start.x, top, -start.y],
                    [end.x, top, -end.y],
                    [end.x, bottom, -end.y]
                ],
                texture: [
                    [0.0, 0.0],
                    [0.0, texturey],
                    [texturex, texturey],
                    [texturex, 0.0]
                ],
                textureBounds: [texture.left, texture.bottom, texture.right, texture.top]
            }
        ]
    }
}

const FLAT_SIZE = 64

const buildFlat = (vertices: WadVertex[], y: number, texture: TextureAtlasEntry): LineLoop => ({
    position: vertices.map((vertex) => [vertex.x, y, -vertex.y]),
    texture: vertices.map((vertex) => [vertex.x / FLAT_SIZE, vertex.y / FLAT_SIZE]),
    textureBounds: [texture.left, texture.bottom, texture.right, texture.top]
})

const hasMiddle = (sidedef: WadSideDef): boolean => sidedef.middleTexture !== '-'

const hasUpper = (sidedef: WadSideDef, front: WadSector, back?: WadSector): boolean =>
    !!back && front.ceilingHeight > back.ceilingHeight && sidedef.upperTexture !== '-'

const hasLower = (sidedef: WadSideDef, front: WadSector, back?: WadSector): boolean =>
    !!back && front.floorHeight < back.floorHeight && sidedef.lowerTexture !== '-'

const processSidedef = (
    atlas: TextureAtlas,
    faces: FaceData[],
    sidedef: WadSideDef,
    start: WadVertex,
    end: WadVertex,
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
                atlas.lookup[sidedef.middleTexture],
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
                atlas.lookup[sidedef.upperTexture],
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
                atlas.lookup[sidedef.lowerTexture],
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
            processSidedef(atlas, faces, front, start, end, frontSector, backSector)
        }
        if (!!back && !!backSector) {
            const { adjacency, faces } = sectorlist[back.sector]
            adjacency.push([linedef.end, linedef.start])
            processSidedef(atlas, faces, back, end, start, backSector, frontSector)
        }
    })
}

const popAdjacency = (adjacency: number[][], current: number): number => {
    const nextI = adjacency.findIndex((a) => a[0] === current)
    if (nextI === -1) {
        throw new Error('Missing vertex in sector adjacency data')
    }
    const next = adjacency.splice(nextI, 1)[0]
    return next[1]
}

const processLoop = (adjacency: number[][]): number[] => {
    const start = adjacency[0][0]
    const indices = [start]
    let current = popAdjacency(adjacency, start)
    while (current !== start) {
        indices.push(current)

        current = popAdjacency(adjacency, current)

        // if (i++ > adjacency.length) {
        //     //throw new Error('Sector adjancency loop not closed')
        //     console.log(`Unclosed sector detected, is that right? ${index}`)
        //     return
        // }
    }
    return indices
}

const addFlats = (sectorlist: SectorData[], map: WadMapLump, atlas: TextureAtlas): void => {
    map.sectors.forEach((sector, index) => {
        const { adjacency, faces } = sectorlist[index]
        const loopIndices = []

        //const debug_prejacency = [...adjacency]
        while (adjacency.length > 0) {
            loopIndices.push(processLoop(adjacency))
        }

        const floorLoops = loopIndices.map((loopIndices) => {
            const vertices = loopIndices.map((index) => map.vertices[index])
            return buildFlat(vertices, sector.floorHeight, atlas.lookup[sector.floorTexture])
        })

        const ceilingLoops = loopIndices.map((loopIndices) => {
            const vertices = loopIndices.map((index) => map.vertices[index])
            return buildFlat(vertices.reverse(), sector.ceilingHeight, atlas.lookup[sector.ceilingTexture])
        })

        faces.push({
            isFlat: true,
            loops: floorLoops
        })
        faces.push({
            isFlat: true,
            loops: ceilingLoops
        })

        // if (loopIndices.length > 1) {
        //     // We can keep processing rings but how do we know which is the perimiter?
        //     console.warn('loop**S**!')
        //     debugger
        // }
    })
}

const buildSectorList = (map: WadMapLump, atlas: TextureAtlas): SectorData[] => {
    const sectorlist = map.sectors.map(() => ({ adjacency: [], faces: [] }))

    addWalls(sectorlist, map, atlas)
    addFlats(sectorlist, map, atlas)

    return sectorlist
}

export const createSectorData = (wad: Wad, atlas: TextureAtlas, name: string): SectorData[] => {
    const wadmap = wad.maps[name]
    if (!wadmap) {
        throw new Error(`Unable to locate map ${name}`)
    }

    return buildSectorList(wadmap, atlas)
}
