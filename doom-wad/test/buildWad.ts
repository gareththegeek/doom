import { WadDirectoryEntry, WAD_DIRECTORY_ENTRY_SIZE } from '../src/interfaces/WadDirectory'

export const writeEntry = (wad: Buffer, offset: number, entry: WadDirectoryEntry): void => {
    wad.writeInt32LE(entry.filepos, offset + 0)
    wad.writeInt32LE(entry.size, offset + 4)
    wad.write(entry.name, offset + 8, 'ascii')
}

export const buildWad = (entries: WadDirectoryEntry[]): Buffer => {
    const directoryOffset = 50
    const wad = Buffer.alloc(directoryOffset + entries.length * WAD_DIRECTORY_ENTRY_SIZE)
    wad.write('IWAD', 'ascii')
    wad.writeInt32LE(entries.length, 4)
    wad.writeInt32LE(directoryOffset, 8)

    entries.forEach((entry, index) => writeEntry(wad, directoryOffset + WAD_DIRECTORY_ENTRY_SIZE * index, entry))

    return wad
}
