import { MapSector } from '../interfaces/MapSector'
import { SectorGeometryData } from '../interfaces/SectorGeometryData'
import { addFlats } from './flats/addFlats'
import { addWalls } from './walls/addWalls'

export const createSingleSectorGeometryData = (sector: MapSector): SectorGeometryData => {
    try {
        const result = { adjacency: [], faces: [] }
        if (sector.sides.length <= 1) {
            // Some maps have degenerate sectors with fewer than 3 lines (no area) e.g. e3m2 sector 21
            return result
        }
        addWalls(result, sector)
        addFlats(result, sector)
        return result
    } catch (e) {
        console.error(e.message)
        throw new Error(`Error creating sector geometry data for sector ${sector.index}`)
    }
}

export const createSectorGeometryData = (sectors: MapSector[]): SectorGeometryData[] =>
    sectors.map((sector) => createSingleSectorGeometryData(sector))
