import { readString } from '../binary'
import { WadDirectoryEntry } from '../interfaces/WadDirectory'
import { WadPNamesLump } from '../interfaces/WadPNamesLump'

const PNAME_SIZE = 8

export const readPNamesLump = (data: Buffer, entry: WadDirectoryEntry): WadPNamesLump => {
    const nummappatches = data.readInt32LE(entry.filepos)
    const names: string[] = []
    for (let i = 0; i < nummappatches; i++) {
        const offset = entry.filepos + 4 + i * PNAME_SIZE
        names.push(readString(data, offset, offset + 8).toLowerCase())
    }
    return { names }
}
