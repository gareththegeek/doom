import { WadDirectoryEntry } from '../interfaces/WadDirectory'
import { WadColour, WadPalette, WadPlayPalLump } from '../interfaces/WadPlayPalLump'

const PALETTE_SIZE = 768
const PALETTE_ENTRY_SIZE = 3

const readPalette = (data: Buffer, offset: number): WadPalette => {
    const colours: WadColour[] = []
    for (let i = 0; i < PALETTE_SIZE; i += PALETTE_ENTRY_SIZE) {
        
        const r = data.readUInt8(offset + i + 0)
        const g = data.readUInt8(offset + i + 1)
        const b = data.readUInt8(offset + i + 2)
        colours.push([r, g, b])
    }
    return { colours }
}

export const readPlayPalLump = (data: Buffer, entry: WadDirectoryEntry): WadPlayPalLump => {
    const palettes = []
    for (let i = 0; i < entry.size / PALETTE_SIZE; i++) {
        const offset = entry.filepos + i * PALETTE_SIZE
        palettes.push(readPalette(data, offset))
    }
    return { palettes }
}
