import { mus2midi } from 'mus2midi'
import { WadDirectoryEntry } from '../interfaces/WadDirectory'
import { WadMusicLump } from '../interfaces/WadMusicLump'

export const readMusicLump = (data: Buffer, entry: WadDirectoryEntry): WadMusicLump => {
    const mus = data.slice(entry.filepos, entry.filepos + entry.size)

    return {
        data: mus2midi(mus)
    }
}
