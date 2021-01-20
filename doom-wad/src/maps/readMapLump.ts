import { WadDirectory, WadDirectoryEntry } from '../interfaces/WadDirectory'
import { WadMapLump } from '../interfaces/WadMapLump'
import { readLineDefsLump } from './readLineDefsLump'
import { readSectorsLump } from './readSectorsLump'
import { readSideDefsLump } from './readSideDefsLump'
import { readThingsLump } from './readThingsLump'
import { readVertexLump } from './readVertexLump'

const MapLumpOffset = {
    things: 1,
    linedefs: 2,
    sidedefs: 3,
    vertex: 4,
    segs: 5,
    ssectors: 6,
    nodes: 7,
    sectors: 8
}

export const readMapLump = (data: Buffer, entry: WadDirectoryEntry, directory?: WadDirectory): WadMapLump => {
    if (!directory) {
        throw new Error('Directory must be passed as a parameter to readMapLump')
    }

    const lumpIndex = directory.entries.findIndex((e) => e.name === entry.name)
    if (lumpIndex === -1) {
        throw new Error(`Unable to find wad directory entry ${entry.name}`)
    }

    return {
        things: readThingsLump(data, directory.entries[lumpIndex + MapLumpOffset.things]),
        linedefs: readLineDefsLump(data, directory.entries[lumpIndex + MapLumpOffset.linedefs]),
        sidedefs: readSideDefsLump(data, directory.entries[lumpIndex + MapLumpOffset.sidedefs]),
        vertices: readVertexLump(data, directory.entries[lumpIndex + MapLumpOffset.vertex]),
        sectors: readSectorsLump(data, directory.entries[lumpIndex + MapLumpOffset.sectors])
    }
}
