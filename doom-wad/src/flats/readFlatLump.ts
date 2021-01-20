import { WadDirectoryEntry } from '../interfaces/WadDirectory'
import { WadFlatLump } from '../interfaces/WadFlatLump'

export const FLAT_HEIGHT = 64
export const FLAT_WIDTH = 64

export const readFlatLump = (data: Buffer, entry: WadDirectoryEntry): WadFlatLump => {
    const pixels: number[][] = []
    for (let i = 0; i < FLAT_HEIGHT; i++) {
        const offset = entry.filepos + i * FLAT_WIDTH
        pixels.push(Array.from(Uint8Array.from(data.slice(offset, offset + FLAT_WIDTH))))
    }
    return { pixels }
}
