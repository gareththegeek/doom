import { readString } from '../binary'
import { WadDirectoryEntry, WadDirectory, WAD_DIRECTORY_ENTRY_SIZE } from '../interfaces/WadDirectory'
import { readHeader } from './readHeader'

const readDirectoryEntry = (data: Buffer, offset: number): WadDirectoryEntry => ({
    filepos: data.readInt32LE(offset),
    size: data.readInt32LE(offset + 4),
    name: readString(data, offset + 8, offset + 16)
})

export const readDirectory = (data: Buffer): WadDirectory => {
    const { identification, numlumps, infotableofs } = readHeader(data)

    const entries = []
    for (let i = 0; i < numlumps; i++) {
        const offset = infotableofs + i * WAD_DIRECTORY_ENTRY_SIZE
        entries.push(readDirectoryEntry(data, offset))
    }
    return { identification, entries }
}
