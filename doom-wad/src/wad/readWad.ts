import { readMusicLump } from '../audio/readMusicLump'
import { readDirectory } from '../directory'
import { readFlatLump } from '../flats'
import { Wad } from '../interfaces/Wad'
import { WadColorMapLump } from '../interfaces/WadColorMapLump'
import { WadDirectory, WadDirectoryEntry } from '../interfaces/WadDirectory'
import { WadLump } from '../interfaces/WadLump'
import { WadMapLump } from '../interfaces/WadMapLump'
import { WadMusicLump } from '../interfaces/WadMusicLump'
import { WadPlayPalLump } from '../interfaces/WadPlayPalLump'
import { WadPNamesLump } from '../interfaces/WadPNamesLump'
import { WadTextureLump } from '../interfaces/WadTextureLump'
import { readMapLump } from '../maps'
import { readPlayPalLump, readColorMapLump } from '../palettes'
import { readPictureLump, readPNamesLump, readTextureLump } from '../textures'

const hasEntry = (directory: WadDirectory, name: string): boolean =>
    directory.entries.find((entry) => entry.name === name) !== undefined

const findEntry = (directory: WadDirectory, name: string): WadDirectoryEntry => {
    const result = directory.entries.find((entry) => entry.name === name)
    if (!result) {
        throw new Error(`Unable to locate lump ${name}`)
    }
    return result
}

const isWad = (wad: Partial<Wad>): wad is Wad => {
    if (!wad.playpal) {
        throw new Error('No playpal lump found')
    }
    if (!wad.colormap) {
        throw new Error('No colormap lump found')
    }
    if (!wad.pnames) {
        throw new Error('No pnames lump found')
    }
    if (!wad.texture1) {
        throw new Error('No texture1 lump found')
    }
    return true
}

export const readWad = (data: Buffer): Wad => {
    const wad: Partial<Wad> = {
        patches: {},
        flats: {},
        sprites: {},
        maps: {},
        music: {}
    }

    const directory = readDirectory(data)
    const unusedLumps = directory.entries.map((entry) => entry.name)

    const markUsed = (name: string): void => {
        unusedLumps.splice(unusedLumps.indexOf(name), 1)
    }

    const readLump = <T extends WadLump>(name: string, strategy: (data: Buffer, entry: WadDirectoryEntry, directory?: WadDirectory) => T): T => {
        markUsed(name)
        return strategy(data, findEntry(directory, name), directory)
    }

    const findRange = (name: string): { start: number; end: number } => {
        const startName = `${name}_start`
        const endName = `${name}_end`
        const start = directory.entries.findIndex((entry) => entry.name === startName)
        const end = directory.entries.findIndex((entry) => entry.name === endName)
        if (start === -1 || end === -1) {
            throw new Error(`failed to find ${startName} and ${endName}`)
        }
        return { start, end }
    }

    const readLumpBlock = <T>(
        name: string,
        strategy: (data: Buffer, entry: WadDirectoryEntry) => T
    ): { [name: string]: T } => {
        const range = findRange(name)
        const result: { [name: string]: T } = {}
        for (let i = range.start; i <= range.end; i++) {
            const entry = directory.entries[i]
            if (entry.size !== 0) {
                result[entry.name] = readLump<T>(entry.name, strategy)
            }
            markUsed(entry.name)
        }
        return result
    }

    wad.playpal = readLump<WadPlayPalLump>('playpal', readPlayPalLump)
    wad.colormap = readLump<WadColorMapLump>('colormap', readColorMapLump)
    wad.pnames = readLump<WadPNamesLump>('pnames', readPNamesLump)
    wad.texture1 = readLump<WadTextureLump>('texture1', readTextureLump)
    if (hasEntry(directory, 'texture2')) {
        wad.texture2 = readLump<WadTextureLump>('texture2', readTextureLump)
    }
    wad.patches = readLumpBlock('p', readPictureLump)
    wad.flats = readLumpBlock('f', readFlatLump)
    wad.sprites = readLumpBlock('s', readPictureLump)

    const maps = directory.entries.filter((entry) => entry.name.match(/^(e[1-4]m[1-9]|map(0[1-9]|[1-2][0-9]|3[0-2]))$/))
    maps.forEach((entry) => (wad.maps![entry.name] = readLump<WadMapLump>(entry.name, readMapLump)))

    const musics = directory.entries.filter((entry) => entry.name.startsWith('d_'))
    musics.forEach((entry) => {
        wad.music![entry.name.replace('d_', '')] = readLump<WadMusicLump>(entry.name, readMusicLump)
    })

    if (!isWad(wad)) {
        throw new Error('Invalid wad')
    }

    if (unusedLumps.length !== 0) {
        console.warn('Unused lumps')
        unusedLumps.forEach((lump) => console.warn(lump))
    }

    return wad
}
