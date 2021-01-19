import { WadIdentification } from './WadHeader'

export const WAD_DIRECTORY_ENTRY_SIZE = 16

export interface WadDirectoryEntry {
    filepos: number
    size: number
    name: string
}

export interface WadDirectory {
    identification: WadIdentification
    entries: WadDirectoryEntry[]
}
