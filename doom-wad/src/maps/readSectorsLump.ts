import { readString } from "../binary"
import { WadDirectoryEntry } from "../interfaces/WadDirectory"
import { WadSector, WadSectorsLump } from "../interfaces/WadSectorsLump"

const SECTOR_SIZE = 26

const SectorOffset = {
    floorHeight: 0,
    ceilingHeight: 2,
    floorTexture: 4,
    ceilingTexture: 12,
    lightLevel: 20,
    specialType: 22,
    tag: 24
}

const readSector = (data: Buffer, offset: number): WadSector => ({
    floorHeight: data.readInt16LE(offset + SectorOffset.floorHeight),
    ceilingHeight: data.readInt16LE(offset + SectorOffset.ceilingHeight),
    floorTexture: readString(data, offset + SectorOffset.floorTexture, offset + SectorOffset.ceilingTexture),
    ceilingTexture: readString(data, offset + SectorOffset.ceilingTexture, offset + SectorOffset.lightLevel),
    lightLevel: data.readInt16LE(offset + SectorOffset.lightLevel),
    specialType: data.readInt16LE(offset + SectorOffset.specialType),
    tag: data.readInt16LE(offset + SectorOffset.tag)
})

export const readSectorsLump = (data: Buffer, entry: WadDirectoryEntry): WadSectorsLump => {
    const length = entry.size / SECTOR_SIZE
    const sectors = []
    for (let i = 0; i < length; i++) {
        sectors.push(readSector(data, entry.filepos + i * SECTOR_SIZE))
    }
    return { sectors }
}
