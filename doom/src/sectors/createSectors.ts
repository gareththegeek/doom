import { SectorInfo } from 'doom-map/dist/interfaces/SectorInfo'
import { WadMapLump } from 'doom-wad/dist/interfaces/WadMapLump'
import { WadSector } from 'doom-wad/dist/interfaces/WadSectorsLump'
import { vec3 } from 'gl-matrix'
import { Sector } from '../interfaces/Sector'

const createSector = (wadSector: WadSector, { buffers }: SectorInfo, index: number): Sector => {
    const geometry = {
        position: [0.0, 0.0, 0.0] as vec3,
        rotation: 0,
        buffers,
        flat: false,
        visible: true,
        light: wadSector.lightLevel
    }

    return {
        index,
        floorHeight: wadSector.floorHeight,
        ceilingHeight: wadSector.ceilingHeight,
        lightLevel: wadSector.lightLevel,
        geometry,
        things: [],
        sides: []
    }
}

export const createSectors = (wadMap: WadMapLump, map: SectorInfo[]): Sector[] =>
    map.map((info, index) => createSector(wadMap.sectors[index], info, index))
