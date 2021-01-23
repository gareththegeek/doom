import { TextureAtlas, TextureAtlasEntry } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { WadMapLump } from 'doom-wad/dist/interfaces/WadMapLump'
import { WadSector } from 'doom-wad/dist/interfaces/WadSectorsLump'
import { WadSideDef } from 'doom-wad/dist/interfaces/WadSideDefsLump'
import { WadVertex } from 'doom-wad/dist/interfaces/WadVertexLump'
import { Map } from './interfaces/Map'
import { FaceData, SectorData } from './interfaces/SectorData'

const buildFace = (
    start: WadVertex,
    end: WadVertex,
    bottom: number,
    top: number,
    texture: TextureAtlasEntry
): FaceData => ({
    position: [
        [start.x, bottom, start.y],
        [start.x, top, start.y],
        [end.x, top, end.y],
        [end.x, bottom, end.y]
    ],
    texture: [
        //TODO figure out texture coordinates based upon size of polygon somehow?
        [0.0, 0.0],
        [0.0, 1.0],
        [1.0, 1.0],
        [1.0, 0.0]
    ],
    textureBounds: [texture.left, texture.bottom, texture.right, texture.top]
})

const buildFlat = (vertices: WadVertex[], y: number, texture: TextureAtlasEntry): FaceData => ({
    position: vertices.map((vertex) => [vertex.x, y, vertex.y]),
    //TODO literally no idea about mapping this right now!
    texture: vertices.map(() => [0.0, 0.0]),
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
                atlas.lookup[sidedef.middleTexture]
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
                atlas.lookup[sidedef.upperTexture]
            )
        )
    }
    if (hasLower(sidedef, frontSector, backSector)) {
        faces.push(
            buildFace(start, end, frontSector.floorHeight, backSector!.floorHeight, atlas.lookup[sidedef.lowerTexture])
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

const addFlats = (sectorlist: SectorData[], map: WadMapLump, atlas: TextureAtlas): void => {
    map.sectors.forEach((sector, index) => {
        const { adjacency, faces } = sectorlist[index]
        const start = adjacency[0][0]
        const indices = [start]
        let current = adjacency[0][1]
        let i = 0
        while (current !== start) {
            indices.push(current)
            const next = adjacency.find((a) => a[0] === current)
            if (!next) {
                throw new Error('Missing vertex in sector adjacency data')
            }
            current = next[1]

            if (i++ > adjacency.length) {
                //throw new Error('Sector adjancency loop not closed')
                console.log(`Unclosed sector detected, is that right? ${index}`)
                return
            }
        }
        const vertices = indices.map((index) => map.vertices[index])
        faces.push(buildFlat(vertices, sector.floorHeight, atlas.lookup[sector.floorTexture]))
        faces.push(buildFlat(vertices.reverse(), sector.ceilingHeight, atlas.lookup[sector.ceilingTexture]))
    })
}

const buildSectorList = (map: WadMapLump, atlas: TextureAtlas): SectorData[] => {
    const sectorlist = map.sectors.map(() => ({ adjacency: [], faces: [] }))

    addWalls(sectorlist, map, atlas)
    addFlats(sectorlist, map, atlas)

    return sectorlist
}

export const createSectorData = (wad: Wad, atlas: TextureAtlas, name: string): SectorData[] => {
    //TODO holes in a sector - this will manifest as two separate adjacency loops on the same sector I guess
    const wadmap = wad.maps[name]
    if (!wadmap) {
        throw new Error(`Unable to locate map ${name}`)
    }

    return buildSectorList(wadmap, atlas)
}
