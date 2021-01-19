import { readDirectory } from '../directory'
import { Wad } from '../interfaces/Wad'
import { readLump } from '../lumps'

const isWad = (wad: Partial<Wad>): wad is Wad => {
    if (!wad.playpal) {
        throw new Error('No playpal lump found')
    }
    return true
}

export const readWad = (data: Buffer): Wad => {
    const result = {}

    const directory = readDirectory(data)

    directory.entries.forEach((entry) => {
        readLump(data, result, entry)
    })

    if (!isWad(result)) {
        throw new Error('Invalid wad')
    }

    return result
}
