import { Wad } from '../interfaces/Wad'
import { WadDirectoryEntry } from '../interfaces/WadDirectory'
import { WadLump, WadLumpType } from '../interfaces/WadLump'
import { readPlayPalLump, readColorMapLump } from '../palettes'
import { readPNamesLump, readTextureLump } from '../textures'

type ReadWadLumpStrategy = (data: Buffer, entry: WadDirectoryEntry) => WadLump

const LumpStrategies: { [key in WadLumpType]: ReadWadLumpStrategy } = {
    playpal: readPlayPalLump,
    colormap: readColorMapLump,
    pnames: readPNamesLump,
    texture1: readTextureLump,
    texture2: readTextureLump
}

const isWadLumpType = (name: string): name is WadLumpType => Object.keys(LumpStrategies).includes(name)

export const readLump = (data: Buffer, wad: Partial<Wad>, entry: WadDirectoryEntry): void => {
    if (!isWadLumpType(entry.name)) {
        console.warn(`Skipping ${entry.name} @ ${entry.filepos}`)
        return
    }
    const strategy = LumpStrategies[entry.name]
    wad[entry.name] = strategy(data, entry) as any
}
