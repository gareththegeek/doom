import { WadMapLump } from 'doom-wad/dist/interfaces/WadMapLump'
import { WadSector } from 'doom-wad/dist/interfaces/WadSectorsLump'
import { MapSector } from '../interfaces/MapSector'

const createSector = (wadSector: WadSector, index: number): MapSector => ({
    index,
    floorHeight: wadSector.floorHeight,
    ceilingHeight: wadSector.ceilingHeight,
    floorTexture: `f_${wadSector.floorTexture}`,
    ceilingTexture: `f_${wadSector.ceilingTexture}`,
    lightLevel: wadSector.lightLevel,
    geometry: undefined,
    dirty: true,
    sides: [],
    tag: wadSector.tag
})

export const createSectors = (wadMap: WadMapLump): MapSector[] =>
    wadMap.sectors.map((wadSector, index) => createSector(wadSector, index))
