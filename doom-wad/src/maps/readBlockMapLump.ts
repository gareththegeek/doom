import { WadBlock, WadBlockMapLump } from '../interfaces/WadBlockmapLump'
import { WadDirectoryEntry } from '../interfaces/WadDirectory'

const BLOCK_OFFSET_SIZE = 2
const LINE_DEF_SIZE = 2

const BlockMapOffset = {
    xorigin: 0,
    yorigin: 2,
    columnCount: 4,
    rowCount: 6,
    offsets: 8
}

const readBlock = (data: Buffer, offset: number): WadBlock => {
    const linedefs = []
    let position = offset + LINE_DEF_SIZE // Skip bizarro 0 linedef
    while (true) {
        const linedef = data.readInt16LE(position)
        if (linedef === -1) {
            return { linedefs }
        }
        linedefs.push(linedef)
        position += LINE_DEF_SIZE
    }
}

export const readBlockMapLump = (data: Buffer, entry: WadDirectoryEntry): WadBlockMapLump => {
    const columnCount = data.readInt16LE(entry.filepos + BlockMapOffset.columnCount)
    const rowCount = data.readInt16LE(entry.filepos + BlockMapOffset.rowCount)
    const blocks = new Array(columnCount)
    for (let x = 0; x < columnCount; x++) {
        blocks[x] = []
        for (let y = 0; y < rowCount; y++) {
            const tableIndex = y * columnCount + x
            const offset = data.readInt16LE(entry.filepos + BlockMapOffset.offsets + tableIndex * BLOCK_OFFSET_SIZE)
            blocks[x].push(readBlock(data, entry.filepos + offset * LINE_DEF_SIZE))
        }
    }
    return {
        xorigin: data.readInt16LE(entry.filepos + BlockMapOffset.xorigin),
        yorigin: data.readInt16LE(entry.filepos + BlockMapOffset.yorigin),
        blocks
    }
}
