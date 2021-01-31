import { Sector } from '../interfaces/Sector'
import { SectorGeometryData } from '../interfaces/SectorGeometryData'
import { addFlats } from './flats/addFlats'
import { addWalls } from './walls/addWalls'

export const createSingleSectorGeometryData = (sector: Sector) => {
    const result = { adjacency: [], faces: [] }
    addWalls(result, sector)
    addFlats(result, sector)
    return result
}

export const createSectorGeometryData = (
    sectors: Sector[]
): SectorGeometryData[] => sectors.map((sector) => createSingleSectorGeometryData(sector))
