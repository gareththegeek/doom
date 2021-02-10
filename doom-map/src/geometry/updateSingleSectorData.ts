import { TextureAtlasEntry } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { MapSector } from '..'
import { M } from '../global'
import { FaceData, LineLoop } from '../interfaces/SectorGeometryData'
import { processSidedef } from './walls/addWalls'

const updateCeiling = (sector: MapSector, loop: LineLoop, vertexIndex: number): void => {
    const p = loop.position[vertexIndex]
    p[1] = sector.ceilingHeight
}

const updateFloor = (sector: MapSector, loop: LineLoop, texture: TextureAtlasEntry, vertexIndex: number): void => {
    const p = loop.position[vertexIndex]
    const a = loop.atlas[vertexIndex]
    p[1] = sector.floorHeight
    a[0] = texture.left
    a[1] = texture.top
    a[2] = texture.right
    a[3] = texture.bottom
}

let sector: MapSector
let faceIndex: number
let sideIndex: number

const getFace = (): FaceData => {
    return sector.geometryData.faces[faceIndex++]
}

const putFace = () => {
    /*stub*/
}

export const updateSingleSectorData = (sectorIn: MapSector): void => {
    const { atlas } = M
    sector = sectorIn
    faceIndex = 0
    sideIndex = 0

    while (faceIndex < sector.geometryData.faces.length) {
        const face = sector.geometryData.faces[faceIndex]
        if (face.isFlat) {
            faceIndex += 1
            const texture = atlas.lookup[sector.floorTexture]
            for (let i = 0; i < face.contour.position.length; i++) {
                if (face.isCeiling) {
                    updateCeiling(sector, face.contour, i)
                } else {
                    updateFloor(sector, face.contour, texture, i)
                }
            }
            for (const hole of face.holes) {
                for (let i = 0; i < hole.position.length; i++) {
                    if (face.isCeiling) {
                        updateCeiling(sector, hole, i)
                    } else {
                        updateFloor(sector, hole, texture, i)
                    }
                }
            }
        } else {
            const side = sector.sides[sideIndex++]
            const isFront = side.line.front === side
            const start = isFront ? side.start : side.end
            const end = isFront ? side.end : side.start
            processSidedef(side, start, end, side.flags, sector, side.other?.sector, getFace, putFace)
        }
    }
}
