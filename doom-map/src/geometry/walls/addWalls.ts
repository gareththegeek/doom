import { TextureAtlasEntry } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { WadLineDefFlags } from 'doom-wad/dist/interfaces/WadLineDefsLump'
import { vec2 } from 'gl-matrix'
import { M } from '../../global'
import { Sector } from '../../interfaces/Sector'
import { FaceData, SectorGeometryData } from '../../interfaces/SectorGeometryData'
import { Side } from '../../interfaces/Side'

const buildFace = (
    start: vec2,
    end: vec2,
    bottom: number,
    top: number,
    sectorTop: number,
    texture: TextureAtlasEntry,
    textureOrigin: TextureOriginType,
    xoffset: number,
    yoffset: number
): FaceData => {
    const width = vec2.length([end[0] - start[0], end[1] - start[1]])
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
                [start[0], bottom, start[1]],
                [start[0], top, start[1]],
                [end[0], top, end[1]],
                [end[0], bottom, end[1]]
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

const hasMiddle = (side: Side): boolean => side.middleTexture !== '-'

const hasUpper = (side: Side, front: Sector, back?: Sector): boolean =>
    !!back && front.ceilingHeight > back.ceilingHeight && side.upperTexture !== '-'

const hasLower = (side: Side, front: Sector, back?: Sector): boolean =>
    !!back && front.floorHeight < back.floorHeight && side.lowerTexture !== '-'

enum TextureOriginType {
    Top = 0,
    Bottom,
    SectorTop
}

const processSidedef = (
    faces: FaceData[],
    side: Side,
    start: vec2,
    end: vec2,
    flags: WadLineDefFlags,
    frontSector: Sector,
    backSector: Sector | undefined
): void => {
    const { atlas } = M
    if (hasMiddle(side)) {
        faces.push(
            buildFace(
                start,
                end,
                frontSector.floorHeight,
                frontSector.ceilingHeight,
                0,
                atlas.lookup[side.middleTexture],
                flags.lowerUnpegged ? TextureOriginType.Bottom : TextureOriginType.Top,
                side.xoffset,
                side.yoffset
            )
        )
    }
    if (hasUpper(side, frontSector, backSector)) {
        faces.push(
            buildFace(
                start,
                end,
                backSector!.ceilingHeight,
                frontSector.ceilingHeight,
                0,
                atlas.lookup[side.upperTexture],
                flags.upperUnpegged ? TextureOriginType.Top : TextureOriginType.Bottom,
                side.xoffset,
                side.yoffset
            )
        )
    }
    if (hasLower(side, frontSector, backSector)) {
        faces.push(
            buildFace(
                start,
                end,
                frontSector.floorHeight,
                backSector!.floorHeight,
                frontSector.ceilingHeight,
                atlas.lookup[side.lowerTexture],
                flags.lowerUnpegged ? TextureOriginType.SectorTop : TextureOriginType.Top,
                side.xoffset,
                side.yoffset
            )
        )
    }
}

export const addWalls = ({ adjacency, faces }: SectorGeometryData, sector: Sector): void => {
    sector.sides.forEach((side) => {
        const isFront = side.line.front === side

        const starti = isFront ? side.line.startIndex : side.line.endIndex
        const endi = isFront ? side.line.endIndex : side.line.startIndex

        adjacency.push([starti, endi])
        processSidedef(faces, side, side.start, side.end, side.flags, sector, side.other?.sector)
    })
}
