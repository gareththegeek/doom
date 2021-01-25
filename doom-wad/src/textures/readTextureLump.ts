import { readString } from '../binary'
import { WadDirectoryEntry } from '../interfaces/WadDirectory'
import { WadMapPatch, WadMapTexture, WadTextureLump } from '../interfaces/WadTextureLump'

const MAP_TEXTURE_SIZE = 22
const MAP_PATCH_SIZE = 10

const MapPatchOffset = {
    originx: 0,
    originy: 2,
    patch: 4,
    stepdir: 6,
    colormap: 8
}

const readMapPatch = (data: Buffer, offset: number): WadMapPatch => ({
    originx: data.readInt16LE(offset + MapPatchOffset.originx),
    originy: data.readInt16LE(offset + MapPatchOffset.originy),
    patch: data.readInt16LE(offset + MapPatchOffset.patch),
    stepdir: data.readInt16LE(offset + MapPatchOffset.stepdir),
    colormap: data.readInt16LE(offset + MapPatchOffset.colormap)
})

const MapTextureOffset = {
    name: 0,
    masked: 8,
    width: 12,
    height: 14,
    columndirectory: 16,
    patches: 20
}

const readMapTexture = (data: Buffer, offset: number): WadMapTexture => {
    const patchcount = data.readInt16LE(offset + MapTextureOffset.patches)
    const patches: WadMapPatch[] = []
    for (let i = 0; i < patchcount; i++) {
        patches.push(readMapPatch(data, offset + MAP_TEXTURE_SIZE + MAP_PATCH_SIZE * i))
    }
    return {
        name: readString(data, offset + MapTextureOffset.name, offset + MapTextureOffset.masked),
        masked: data.readUInt32LE(offset + MapTextureOffset.masked) !== 0,
        width: data.readInt16LE(offset + MapTextureOffset.width),
        height: data.readInt16LE(offset + MapTextureOffset.height),
        columndirectory: data.readInt32LE(offset + MapTextureOffset.columndirectory),
        patches
    }
}

export const readTextureLump = (data: Buffer, entry: WadDirectoryEntry): WadTextureLump => {
    const numtextures = data.readInt32LE(entry.filepos)
    const maptextures: WadMapTexture[] = []
    for (let i = 0; i < numtextures; i++) {
        const offset = entry.filepos + data.readInt32LE(entry.filepos + 4 + i * 4)
        maptextures.push(readMapTexture(data, offset))
    }
    return { maptextures }
}
