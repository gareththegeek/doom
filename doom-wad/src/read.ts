import * as fs from 'fs'
import { Wad } from './Wad'
import {
    WadDirectory,
    WadDirectoryEntry,
    WAD_DIRECTORY_ENTRY_SIZE
} from './WadDirectory'
import { WadHeader, WadIdentification } from './WadHeader'

const readString = (data: Buffer, start: number, end: number): string =>
    data.toString('ascii', start, end).replace(/\0/g, '')

const isWad = (identification: string): identification is WadIdentification =>
    identification === 'IWAD' || identification === 'PWAD'

const readHeader = (data: Buffer): WadHeader => {
    const identification = readString(data, 0, 4)
    if (!isWad(identification)) {
        throw new Error(`Unsupported file format '${identification}'`)
    }

    const result = {
        identification,
        numlumps: data.readInt32LE(4),
        infotableofs: data.readInt32LE(8)
    }

    return result
}

const readDirectoryEntry = (
    data: Buffer,
    offset: number
): WadDirectoryEntry => ({
    filepos: data.readInt32LE(offset),
    size: data.readInt32LE(offset + 4),
    name: readString(data, offset + 8, offset + 16)
})

const readDirectory = (data: Buffer, header: WadHeader): WadDirectory => {
    const entries = []
    for (let i = 0; i < header.numlumps; i++) {
        const offset = header.infotableofs + i * WAD_DIRECTORY_ENTRY_SIZE
        entries.push(readDirectoryEntry(data, offset))
    }
    return { entries }
}

export const read = async (filename: string): Promise<Wad | null> =>
    new Promise((resolve, reject) => {
        fs.readFile(filename, (err, data) => {
            if (err) {
                reject(err)
            }

            const head = readHeader(data)
            const directory = readDirectory(data, head)

            console.log(directory)

            resolve(null)
        })
    })
