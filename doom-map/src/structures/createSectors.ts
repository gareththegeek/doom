import { WadMapLump } from 'doom-wad/dist/interfaces/WadMapLump'
import { WadSector } from 'doom-wad/dist/interfaces/WadSectorsLump'
import { Sector } from '../interfaces/Sector'

const createSector = (wadSector: WadSector, index: number): Sector => ({
    index,
    floorHeight: wadSector.floorHeight,
    ceilingHeight: wadSector.ceilingHeight,
    floorTexture: `f_${wadSector.floorTexture}`,
    ceilingTexture: `f_${wadSector.ceilingTexture}`,
    lightLevel: wadSector.lightLevel,
    geometry: undefined,
    dirty: true,
    things: [],
    sides: [],
    tag: wadSector.tag
})

export const createSectors = (wadMap: WadMapLump): Sector[] =>
    wadMap.sectors.map((wadSector, index) => createSector(wadSector, index))
