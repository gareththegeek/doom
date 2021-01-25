import { WadColorMap, WadColorMapLump } from '../interfaces/WadColorMapLump'
import { WadDirectoryEntry } from '../interfaces/WadDirectory'

const COLOR_MAP_SIZE = 256

const readColorMap = (data: Buffer, offset: number): WadColorMap => {
    const indices: number[] = []
    
    for (let i = 0; i < COLOR_MAP_SIZE; i += 1) {
        indices.push(data.readUInt8(offset + i))
    }
    return { indices }
}

export const readColorMapLump = (data: Buffer, entry: WadDirectoryEntry): WadColorMapLump => {
    const maps = []
    for (let i = 0; i < entry.size / COLOR_MAP_SIZE; i++) {
        const offset = entry.filepos + i * COLOR_MAP_SIZE
        maps.push(readColorMap(data, offset))
    }
    return { maps }
}
