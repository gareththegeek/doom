import { TextureAtlas } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { WadMapLump } from 'doom-wad/dist/interfaces/WadMapLump'
import { WadVertex } from 'doom-wad/dist/interfaces/WadVertexLump'
import { Line } from '..'
import { Sector } from '../interfaces/Sector'
import { SectorGeometryData } from '../interfaces/SectorGeometryData'
import { addFlats } from './flats/addFlats'
import { addWalls } from './walls/addWalls'

export const createSingleSectorGeometryData = (atlas: TextureAtlas, vertices: WadVertex[], sector: Sector) => {
    const result = { adjacency: [], faces: [] }
    addWalls(atlas, result, sector)
    addFlats(atlas, vertices, result, sector)
    return result
}

export const createSectorGeometryData = (
    atlas: TextureAtlas,
    vertices: WadVertex[],
    sectors: Sector[]
): SectorGeometryData[] => sectors.map((sector) => createSingleSectorGeometryData(atlas, vertices, sector))
