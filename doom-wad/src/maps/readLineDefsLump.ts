import { WadDirectoryEntry } from '../interfaces/WadDirectory'
import { WadLineDef, WadLineDefFlags } from '../interfaces/WadLineDefsLump'

const LINE_DEFS_SIZE = 14

const LineDefOffset = {
    start: 0,
    end: 2,
    flags: 4,
    specialType: 6,
    sectorTag: 8,
    front: 10,
    back: 12
}

const toLineDefFlags = (flags: number): WadLineDefFlags => ({
    blocks: (flags & 0x0001) !== 0,
    blocksMonstersOnly: (flags & 0x0002) !== 0,
    twoSided: (flags & 0x0004) !== 0,
    upperUnpegged: (flags & 0x0008) !== 0,
    lowerUnpegged: (flags & 0x0010) !== 0,
    secret: (flags & 0x0020) !== 0,
    blocksSound: (flags & 0x0040) !== 0,
    noAutomap: (flags & 0x0080) !== 0,
    alwaysAutomap: (flags & 0x0100) !== 0
})

const readLineDef = (data: Buffer, offset: number): WadLineDef => ({
    start: data.readInt16LE(offset + LineDefOffset.start),
    end: data.readInt16LE(offset + LineDefOffset.end),
    flags: toLineDefFlags(data.readInt16LE(offset + LineDefOffset.flags)),
    specialType: data.readInt16LE(offset + LineDefOffset.specialType),
    sectorTag: data.readInt16LE(offset + LineDefOffset.sectorTag),
    front: data.readInt16LE(offset + LineDefOffset.front),
    back: data.readInt16LE(offset + LineDefOffset.back)
})

export const readLineDefsLump = (data: Buffer, entry: WadDirectoryEntry): WadLineDef[] => {
    const length = entry.size / LINE_DEFS_SIZE
    const linedefs = []
    for (let i = 0; i < length; i++) {
        linedefs.push(readLineDef(data, entry.filepos + i * LINE_DEFS_SIZE))
    }
    return linedefs
}
