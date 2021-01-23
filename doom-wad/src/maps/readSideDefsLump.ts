import { readString } from '../binary'
import { WadDirectoryEntry } from '../interfaces/WadDirectory'
import { WadSideDef } from '../interfaces/WadSideDefsLump'

const SIDE_DEFS_SIZE = 30

const SideDefOffset = {
    xoffset: 0,
    yoffset: 2,
    upperTexture: 4,
    lowerTexture: 12,
    middleTexture: 20,
    sector: 28
}

const readSideDef = (data: Buffer, offset: number): WadSideDef => ({
    xoffset: data.readInt16LE(offset + SideDefOffset.xoffset),
    yoffset: data.readInt16LE(offset + SideDefOffset.yoffset),
    upperTexture: readString(data, offset + SideDefOffset.upperTexture, offset + SideDefOffset.lowerTexture),
    lowerTexture: readString(data, offset + SideDefOffset.lowerTexture, offset + SideDefOffset.middleTexture),
    middleTexture: readString(data, offset + SideDefOffset.middleTexture, offset + SideDefOffset.sector),
    sector: data.readInt16LE(offset + SideDefOffset.sector)
})

export const readSideDefsLump = (data: Buffer, entry: WadDirectoryEntry): WadSideDef[] => {
    const length = entry.size / SIDE_DEFS_SIZE
    const sidedefs = []
    for (let i = 0; i < length; i++) {
        sidedefs.push(readSideDef(data, entry.filepos + i * SIDE_DEFS_SIZE))
    }
    return sidedefs
}
