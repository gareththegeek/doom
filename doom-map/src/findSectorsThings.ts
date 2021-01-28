import { WadThing } from 'doom-wad/dist/interfaces/WadThingsLump'
import { vec2, vec3 } from 'gl-matrix'
import { SectorData } from './interfaces/SectorData'
import { SectorThing } from './interfaces/SectorInfo'
import { pointInPolygon } from './pointInPolygon'

const vec3ToVec2 = (pos: vec3): vec2 => [pos[0], pos[2]]

const thingInSector = (sectorData: SectorData, thing: WadThing, i: number, si: number): boolean => {
    const point = [thing.x, -thing.y] as vec2
    const floors = sectorData.faces.filter((face) => face.isFlat && !face.isCeiling)
    for (let floor of floors) {
        if (!pointInPolygon(point, floor.contour.position.map(vec3ToVec2))) {
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

const findSectorThings = (sectorData: SectorData, sectorIndex: number, things: WadThing[]): SectorThing[] =>
    things
        .map((thing, index) => ({ thing, index }))
        .filter(({ thing },i) => thingInSector(sectorData, thing, i, sectorIndex))
        .map(({ index }) => ({
            sector: sectorIndex,
            thing: index
        }))

export const findSectorsThings = (sectorlist: SectorData[], things: WadThing[]): SectorThing[][] =>
    sectorlist.map((sectorData, index) => findSectorThings(sectorData, index, things))
