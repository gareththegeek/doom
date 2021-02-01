import { WadThing } from 'doom-wad/dist/interfaces/WadThingsLump'
import { vec2, vec3 } from 'gl-matrix'
import { SectorGeometryData } from '../interfaces/SectorGeometryData'
import { pointInPolygon } from '../geometry/pointInPolygon'

const vec3ToVec2 = (pos: vec3): vec2 => [pos[0], pos[2]]

export const thingInSector = (sectorData: SectorGeometryData, thing: WadThing): boolean => {
    const point = [thing.x, -thing.y] as vec2
    const floors = sectorData.faces.filter((face) => face.isFlat && !face.isCeiling)
    for (let floor of floors) {
        if (!pointInPolygon(point, floor.contour.position.map(vec3ToVec2), true)) {
            continue
        }

        for (let hole of floor.holes) {
            if (pointInPolygon(point, hole.position.map(vec3ToVec2))) {
                return false
            }
        }
        return true
    }
    return false
}
