import { readBytes } from '../binary'
import { WadDirectoryEntry } from '../interfaces/WadDirectory'
import { IndexedPixel, WadPictureLump } from '../interfaces/WadPictureLump'

const COLUMN_OFFSET_SIZE = 4

const PictureColumnOffset = {
    topdelta: 0,
    length: 1,
    data: 3
}

const PictureLumpOffset = {
    width: 0,
    height: 2,
    leftoffset: 4,
    topoffset: 6,
    columnofs: 8
}

const readPost = (data: Buffer, offset: number): IndexedPixel[] => {
    const length = data.readUInt8(offset + PictureColumnOffset.length)
    const start = offset + PictureColumnOffset.data

    return readBytes(data, start, length)
}

const readPictureColumn = (data: Buffer, height: number, startoffset: number): IndexedPixel[] => {
    const pixels = new Array(height).fill(undefined)
    let offset = startoffset
    while (true) {
        const topdelta = data.readUInt8(offset + PictureColumnOffset.topdelta)
        if (topdelta === 0xff) {
            return pixels
        }

        const post = readPost(data, offset)
        pixels.splice(topdelta, post.length, ...post)
        offset += PictureColumnOffset.data + post.length + 1
    }
}

export const readPictureLump = (data: Buffer, entry: WadDirectoryEntry): WadPictureLump => {
    const width = data.readInt16LE(entry.filepos + PictureLumpOffset.width)
    const height = data.readInt16LE(entry.filepos + PictureLumpOffset.height)
    const leftoffset = data.readInt16LE(entry.filepos + PictureLumpOffset.leftoffset)
    const topoffset = data.readInt16LE(entry.filepos + PictureLumpOffset.topoffset)

    const pixels: IndexedPixel[][] = []
    for (let i = 0; i < width; i++) {
        const offset = entry.filepos + PictureLumpOffset.columnofs + i * COLUMN_OFFSET_SIZE
        const columnofs = data.readInt32LE(offset)
        pixels.push(readPictureColumn(data, height, entry.filepos + columnofs))
    }

    return {
        width,
        height,
        leftoffset,
        topoffset,
        pixels
    }
}
