import { WadMapLump } from 'doom-wad/dist/interfaces/WadMapLump'
import { WadSector } from 'doom-wad/dist/interfaces/WadSectorsLump'
import { Sector } from '../interfaces/Sector'

const createSector = (wadSector: WadSector, index: number): Sector => ({
    index,
    floorHeight: wadSector.floorHeight,
    ceilingHeight: wadSector.ceilingHeight,
    floorTexture: wadSector.floorTexture,
    ceilingTexture: wadSector.ceilingTexture,
    lightLevel: wadSector.lightLevel,
    geometry: undefined,
    things: [],
    sides: [],
    tag: wadSector.tag
})

export const createSectors = (wadMap: WadMapLump): Sector[] =>
    wadMap.sectors.map((wadSector, index) => createSector(wadSector, index))
