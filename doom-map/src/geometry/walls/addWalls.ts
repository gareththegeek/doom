import { TextureAtlasEntry } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { WadLineDefFlags } from 'doom-wad/dist/interfaces/WadLineDefsLump'
import { vec2 } from 'gl-matrix'
import { M } from '../../global'
import { MapSector } from '../../interfaces/MapSector'
import { FaceData, SectorGeometryData } from '../../interfaces/SectorGeometryData'
import { MapSide } from '../../interfaces/MapSide'
import { hasTexture } from './isNullTexture'

const createFace = (): FaceData => ({
    isFlat: false,
    isCeiling: false,
    holes: [],
    contour: {
        position: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ],
        texture: [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
        ],
        atlas: [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        sky: [0, 0, 0, 0]
    }
})

const buildFace = (
    face: FaceData,
    start: vec2,
    end: vec2,
    bottom: number,
    top: number,
    sectorTop: number,
    textureEntry: TextureAtlasEntry,
    textureOrigin: TextureOriginType,
    xoffset: number,
    yoffset: number,
    isSky = false
): void => {
    const width = vec2.length([end[0] - start[0], end[1] - start[1]])
    const height = top - bottom

    const { pixelWidth, pixelHeight } = textureEntry

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

    const { position, texture, atlas, sky } = face.contour
    let p0 = position[0]
    let p1 = position[1]
    let p2 = position[2]
    let p3 = position[3]
    let t0 = texture[0]
    let t1 = texture[1]
    let t2 = texture[2]
    let t3 = texture[3]
    let a0 = atlas[0]
    let a1 = atlas[1]
    let a2 = atlas[2]
    let a3 = atlas[3]
    let s = sky

    // Position
    p0[0] = start[0]
    p0[1] = bottom
    p0[2] = start[1]

    p1[0] = start[0]
    p1[1] = top
    p1[2] = start[1]

    p2[0] = end[0]
    p2[1] = top
    p2[2] = end[1]

    p3[0] = end[0]
    p3[1] = bottom
    p3[2] = end[1]

    // Texture
    t0[0] = x0
    t0[1] = y1

    t1[0] = x0
    t1[1] = y0

    t2[0] = x1
    t2[1] = y0

    t3[0] = x1
    t3[1] = y1

    // Atlas
    a0[0] = textureEntry.left
    a0[1] = textureEntry.top
    a0[2] = textureEntry.right
    a0[3] = textureEntry.bottom

    a1[0] = textureEntry.left
    a1[1] = textureEntry.top
    a1[2] = textureEntry.right
    a1[3] = textureEntry.bottom

    a2[0] = textureEntry.left
    a2[1] = textureEntry.top
    a2[2] = textureEntry.right
    a2[3] = textureEntry.bottom

    a3[0] = textureEntry.left
    a3[1] = textureEntry.top
    a3[2] = textureEntry.right
    a3[3] = textureEntry.bottom

    // Sky
    const ss = isSky ? 1 : 0
    s[0] = ss
    s[1] = ss
    s[2] = ss
    s[3] = ss
}

const hasMiddle = (side: MapSide): boolean => hasTexture(side.middleTexture)

const hasUpper = (side: MapSide, front: MapSector, back?: MapSector): boolean =>
    !!back &&
    (hasTexture(side.upperTexture) || isSky(front))

const isSky = (back: MapSector) => back.ceilingTexture === 'f_f_sky1'

const hasLower = (side: MapSide, back?: MapSector): boolean =>
    !!back &&
    hasTexture(side.lowerTexture)

enum TextureOriginType {
    Top = 0,
    Bottom,
    SectorTop
}

export const processSidedef = (
    side: MapSide,
    start: vec2,
    end: vec2,
    flags: WadLineDefFlags,
    frontSector: MapSector,
    backSector: MapSector | undefined,
    getFace: () => FaceData,
    putFace: (face: FaceData) => void
): void => {
    const { atlas } = M
    if (hasMiddle(side)) {
        const middle = getFace()
        buildFace(
            middle,
            start,
            end,
            Math.max(frontSector.floorHeight, backSector?.floorHeight ?? -0x7fff),
            Math.min(frontSector.ceilingHeight, backSector?.ceilingHeight ?? 0x7fff),
            0,
            atlas.lookup[side.middleTexture],
            flags.lowerUnpegged ? TextureOriginType.Bottom : TextureOriginType.Top,
            side.xoffset,
            side.yoffset
        )
        putFace(middle)
    }
    if (hasUpper(side, frontSector, backSector)) {
        const upper = getFace()
        const sky = isSky(backSector!)
        const texture = sky
            ? atlas.lookup['sky1'] //TODO how do we know what sky we're using? is it by episode?
            : atlas.lookup[side.upperTexture]
        buildFace(
            upper,
            start,
            end,
            backSector!.ceilingHeight,
            frontSector.ceilingHeight,
            0,
            texture,
            flags.upperUnpegged ? TextureOriginType.Top : TextureOriginType.Bottom,
            side.xoffset,
            side.yoffset,
            isSky(backSector!)
        )
        putFace(upper)
    }
    if (hasLower(side, backSector)) {
        const lower = getFace()
        buildFace(
            lower,
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
        putFace(lower)
    }
}

export const addWalls = ({ adjacency, faces }: SectorGeometryData, sector: MapSector): void => {
    sector.sides.forEach((side) => {
        const isFront = side.line.front === side

        const starti = isFront ? side.line.startIndex : side.line.endIndex
        const endi = isFront ? side.line.endIndex : side.line.startIndex
        const start = isFront ? side.start : side.end
        const end = isFront ? side.end : side.start

        adjacency.push([starti, endi])
        processSidedef(side, start, end, side.flags, sector, side.other?.sector, createFace, (face) =>
            faces.push(face)
        )
    })
}
