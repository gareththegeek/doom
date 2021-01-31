import { TextureAtlas } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { WadMapLump } from 'doom-wad/dist/interfaces/WadMapLump'
import { Sector } from '../interfaces/Sector'
import { SectorGeometryData } from '../interfaces/SectorGeometryData'
import { addFlats } from './flats/addFlats'
import { addWalls } from './walls/addWalls'

export const createSectorGeometryData = (
    atlas: TextureAtlas,
    { linedefs, vertices }: WadMapLump,
    sectors: Sector[]
): SectorGeometryData[] =>
    sectors.map((sector) => {
        const result = { adjacency: [], faces: [] }
        addWalls(atlas, linedefs, result, sector)
        addFlats(atlas, vertices, result, sector)
        return result
    })
