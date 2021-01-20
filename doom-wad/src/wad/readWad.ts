import { readDirectory } from '../directory'
import { readFlatLump } from '../flats'
import { Wad } from '../interfaces/Wad'
import { WadColorMapLump } from '../interfaces/WadColorMapLump'
import { WadDirectory, WadDirectoryEntry } from '../interfaces/WadDirectory'
import { WadFlatLump } from '../interfaces/WadFlatLump'
import { WadLump } from '../interfaces/WadLump'
import { WadPictureLump } from '../interfaces/WadPictureLump'
import { WadPlayPalLump } from '../interfaces/WadPlayPalLump'
import { WadPNamesLump } from '../interfaces/WadPNamesLump'
import { WadTextureLump } from '../interfaces/WadTextureLump'
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
        sprites: {}
    }

    const directory = readDirectory(data)
    const unusedLumps = directory.entries.map((entry) => entry.name).sort()

    const readLump = <T extends WadLump>(name: string, strategy: (data: Buffer, entry: WadDirectoryEntry) => T): T => {
        unusedLumps.splice(unusedLumps.indexOf(name), 1)
        return strategy(data, findEntry(directory, name))
    }

    const findRange = (name: string): { start: number; end: number } => {
        const startName = `${name}_start`
        const endName = `${name}_end`
        const start = directory.entries.findIndex((entry) => entry.name === startName)
        const end = directory.entries.findIndex((entry) => entry.name === endName)
        if (start === -1 || end === -1) {
            throw new Error(`failed to find ${startName} and ${endName}`)
        }
        unusedLumps.splice(unusedLumps.indexOf(startName), 1)
        unusedLumps.splice(unusedLumps.indexOf(endName), 1)
        return { start, end }
    }

    wad.playpal = readLump<WadPlayPalLump>('playpal', readPlayPalLump)
    wad.colormap = readLump<WadColorMapLump>('colormap', readColorMapLump)
    wad.pnames = readLump<WadPNamesLump>('pnames', readPNamesLump)
    wad.texture1 = readLump<WadTextureLump>('texture1', readTextureLump)
    if (hasEntry(directory, 'texture2')) {
        wad.texture2 = readLump<WadTextureLump>('texture2', readTextureLump)
    }

    if (!isWad(wad)) {
        throw new Error('Invalid wad')
    }

    wad.pnames.names.forEach((name) => {
        if (!hasEntry(directory, name)) {
            throw new Error(`Unable to locate patch lump ${name}`)
        }
        wad.patches[name] = readLump<WadPictureLump>(name, readPictureLump)
    })

    const flatsRange = findRange('f')
    for (let i = flatsRange.start + 1; i < flatsRange.end; i++) {
        const entry = directory.entries[i]
        wad.flats[entry.name] = readLump<WadFlatLump>(entry.name, readFlatLump)
    }
    const spritesRange = findRange('s')
    for (let i = spritesRange.start + 1; i < spritesRange.end; i++) {
        const entry = directory.entries[i]
        wad.sprites[entry.name] = readLump<WadPictureLump>(entry.name, readPictureLump)
    }

    if (unusedLumps.length !== 0) {
        console.warn('Unused lumps')
        unusedLumps.forEach((lump) => console.log(lump))
    }

    return wad
}
