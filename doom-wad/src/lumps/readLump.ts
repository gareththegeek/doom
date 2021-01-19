import { readColorMapLump } from '../colourmaps'
import { Wad } from '../interfaces/Wad'
import { WadDirectoryEntry } from '../interfaces/WadDirectory'
import { readPlayPalLump } from '../palettes'

export const readLump = (data: Buffer, wad: Partial<Wad>, entry: WadDirectoryEntry): void => {
    switch (entry.name.toUpperCase()) {
        case 'PLAYPAL': {
            wad.playpal = readPlayPalLump(data, entry)
            break
        }
        case 'COLORMAP': {
            wad.colormap = readColorMapLump(data, entry)
            break
        }
        default:
            console.warn(`Skipping ${entry.name} @ ${entry.filepos}`)
    }
}
