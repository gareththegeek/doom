import { pointInPolygon } from 'doom-map'
import { WadThing } from 'doom-wad/dist/interfaces/WadThingsLump'
import { vec2 } from 'gl-matrix'
import { Sector } from '../interfaces/Sector'

const getSectorLineCoordinates = (sector: Sector): vec2[] => sector.sides.map((side) => side.start)

export const findThingSector = (sectors: Sector[], wadThing: WadThing): Sector | undefined => {
    const point = [wadThing.x, -wadThing.y] as vec2
    return sectors.find((sector) => pointInPolygon(point, getSectorLineCoordinates(sector)))
}
